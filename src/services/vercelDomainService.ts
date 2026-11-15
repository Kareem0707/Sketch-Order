import type { LiveDnsCheckResult, VercelConfig, VercelDomainRecord } from '../types';

const VERCEL_ANYCAST_IPS = ['76.76.21.21', '76.76.21.22', '76.76.21.98', '76.76.21.9'];
const STORAGE_VERCEL_TOKEN = 'sketch_vercel_token';
const STORAGE_VERCEL_PROJECT_ID = 'sketch_vercel_project_id';
const STORAGE_VERCEL_TEAM_ID = 'sketch_vercel_team_id';

/**
 * Retrieve Vercel API configuration from env or localStorage
 */
export const getActiveVercelConfig = (): VercelConfig => {
  const envToken = (import.meta as any).env?.VITE_VERCEL_TOKEN;
  const envProjectId = (import.meta as any).env?.VITE_VERCEL_PROJECT_ID;
  const envTeamId = (import.meta as any).env?.VITE_VERCEL_TEAM_ID;

  const savedToken = localStorage.getItem(STORAGE_VERCEL_TOKEN);
  const savedProjectId = localStorage.getItem(STORAGE_VERCEL_PROJECT_ID);
  const savedTeamId = localStorage.getItem(STORAGE_VERCEL_TEAM_ID);

  return {
    token: (savedToken || envToken || '').trim(),
    projectId: (savedProjectId || envProjectId || 'sketch-order').trim(),
    teamId: (savedTeamId || envTeamId || '').trim() || undefined,
  };
};

/**
 * Save Vercel API configuration to localStorage
 */
export const saveVercelConfig = (config: VercelConfig): void => {
  try {
    if (config.token) {
      localStorage.setItem(STORAGE_VERCEL_TOKEN, config.token.trim());
    } else {
      localStorage.removeItem(STORAGE_VERCEL_TOKEN);
    }

    if (config.projectId) {
      localStorage.setItem(STORAGE_VERCEL_PROJECT_ID, config.projectId.trim());
    } else {
      localStorage.removeItem(STORAGE_VERCEL_PROJECT_ID);
    }

    if (config.teamId) {
      localStorage.setItem(STORAGE_VERCEL_TEAM_ID, config.teamId.trim());
    } else {
      localStorage.removeItem(STORAGE_VERCEL_TEAM_ID);
    }
  } catch (err) {
    console.error('Failed to save Vercel config:', err);
  }
};

/**
 * Check whether Vercel credentials are fully configured
 */
export const isVercelConfigured = (): boolean => {
  const config = getActiveVercelConfig();
  return !!(config.token && config.projectId && !config.token.includes('your-vercel-token'));
};

/**
 * Perform a REAL live DNS resolution via Google Public DNS-over-HTTPS (DoH)
 * This directly checks if the domain points to Vercel (76.76.21.21) on the global internet!
 */
export const checkDomainLiveDns = async (domainRaw: string): Promise<LiveDnsCheckResult> => {
  const domain = domainRaw
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .trim()
    .toLowerCase();

  const nowIso = new Date().toISOString();

  if (!domain) {
    return {
      domain: '',
      isVercelIp: false,
      resolvedIps: [],
      cnameTargets: [],
      status: 'error',
      message: 'اسم الدومين غير صحيح أو فارغ.',
      checkedAt: nowIso,
    };
  }

  try {
    // 1. Query A records from Google Public DNS
    const aUrl = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`;
    const aRes = await fetch(aUrl, { headers: { Accept: 'application/json' } });
    const aData = await aRes.json();

    const resolvedIps: string[] = [];
    const cnameTargets: string[] = [];

    if (Array.isArray(aData.Answer)) {
      for (const record of aData.Answer) {
        if (record.type === 1 && record.data) {
          // Type 1 = A record (IPv4)
          resolvedIps.push(record.data.trim());
        } else if (record.type === 5 && record.data) {
          // Type 5 = CNAME record
          cnameTargets.push(record.data.trim().replace(/\.$/, ''));
        }
      }
    }

    // 2. Also check CNAME specifically if it's a subdomain
    if (domain.split('.').length > 2 && cnameTargets.length === 0) {
      try {
        const cnameUrl = `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=CNAME`;
        const cnameRes = await fetch(cnameUrl, { headers: { Accept: 'application/json' } });
        const cnameData = await cnameRes.json();
        if (Array.isArray(cnameData.Answer)) {
          for (const record of cnameData.Answer) {
            if (record.type === 5 && record.data) {
              cnameTargets.push(record.data.trim().replace(/\.$/, ''));
            }
          }
        }
      } catch {}
    }

    // Check if points to Vercel
    const pointsToVercelIp = resolvedIps.some((ip) => VERCEL_ANYCAST_IPS.includes(ip));
    const pointsToVercelCname = cnameTargets.some(
      (c) => c.includes('vercel-dns.com') || c.includes('vercel.app')
    );

    const isVercel = pointsToVercelIp || pointsToVercelCname;

    if (isVercel) {
      return {
        domain,
        isVercelIp: true,
        resolvedIps,
        cnameTargets,
        status: 'pointing_to_vercel',
        rawAnswer: aData,
        message: `تم التحقق الفعلي عبر Google DNS: الدومين موجه لسيرفرات Vercel بنجاح (${resolvedIps.join(', ') || cnameTargets.join(', ')}). المتجر شغال ومفعل عالمياً.`,
        checkedAt: nowIso,
      };
    }

    if (resolvedIps.length === 0 && cnameTargets.length === 0) {
      return {
        domain,
        isVercelIp: false,
        resolvedIps: [],
        cnameTargets: [],
        status: 'not_found',
        rawAnswer: aData,
        message: `الدومين (${domain}) غير مسجل أو لم يتم إضافة سجلات DNS له بعد. يرجى التوجه لشركة الدومين (Namecheap, GoDaddy, الخ) وإضافة سجل A بالقيمة 76.76.21.21`,
        checkedAt: nowIso,
      };
    }

    return {
      domain,
      isVercelIp: false,
      resolvedIps,
      cnameTargets,
      status: 'not_pointing',
      rawAnswer: aData,
      message: `الدومين موجه حالياً إلى (${resolvedIps.join(', ')}). للربط بسيرفرات فيرسل، يجب تغيير سجل A إلى 76.76.21.21 أو CNAME إلى cname.vercel-dns.com`,
      checkedAt: nowIso,
    };
  } catch (err: any) {
    console.error('DNS query error:', err);
    return {
      domain,
      isVercelIp: false,
      resolvedIps: [],
      cnameTargets: [],
      status: 'error',
      message: `تعذر الاتصال بسيرفر فحص DNS: ${err?.message || 'خطأ في الشبكة'}.`,
      checkedAt: nowIso,
    };
  }
};

/**
 * Helper to construct Vercel API URL with optional teamId
 */
const getVercelApiUrl = (endpoint: string, teamId?: string): string => {
  const base = `https://api.vercel.com${endpoint}`;
  if (teamId) {
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}teamId=${encodeURIComponent(teamId)}`;
  }
  return base;
};

/**
 * Test connection to Vercel API with project credentials
 */
export const testVercelConnection = async (): Promise<{
  success: boolean;
  project?: any;
  error?: string;
}> => {
  const config = getActiveVercelConfig();
  if (!config.token || !config.projectId) {
    return {
      success: false,
      error: 'يرجى إدخال Vercel Token و Project ID أولاً.',
    };
  }

  try {
    const url = getVercelApiUrl(`/v9/projects/${encodeURIComponent(config.projectId)}`, config.teamId);
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error?.message || `Vercel API returned status ${res.status}`,
      };
    }

    return {
      success: true,
      project: data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'فشل الاتصال بـ Vercel API.',
    };
  }
};

/**
 * Real Vercel API: Add custom domain to the Vercel project
 */
export const addDomainToVercel = async (
  domainRaw: string
): Promise<{
  success: boolean;
  data?: VercelDomainRecord;
  error?: string;
}> => {
  const config = getActiveVercelConfig();
  const domain = domainRaw
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .trim()
    .toLowerCase();

  if (!config.token || !config.projectId) {
    return {
      success: false,
      error: 'Vercel Token أو Project ID غير مهيأ. يمكنك تهيئته في لوحة الإدارة أو ملف .env.',
    };
  }

  try {
    const url = getVercelApiUrl(
      `/v10/projects/${encodeURIComponent(config.projectId)}/domains`,
      config.teamId
    );

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error?.message || `تعذر إضافة الدومين إلى فيرسل (${res.status})`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'خطأ أثناء الاتصال بـ Vercel API.',
    };
  }
};

/**
 * Real Vercel API: Verify custom domain on Vercel
 */
export const verifyDomainOnVercel = async (
  domainRaw: string
): Promise<{
  success: boolean;
  verified?: boolean;
  data?: any;
  error?: string;
}> => {
  const config = getActiveVercelConfig();
  const domain = domainRaw
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '')
    .trim()
    .toLowerCase();

  if (!config.token || !config.projectId) {
    return {
      success: false,
      error: 'بيانات Vercel API غير مكتملة.',
    };
  }

  try {
    const url = getVercelApiUrl(
      `/v9/projects/${encodeURIComponent(config.projectId)}/domains/${encodeURIComponent(domain)}/verify`,
      config.teamId
    );

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error?.message || `فشل فحص توثيق الدومين على فيرسل (${res.status})`,
      };
    }

    return {
      success: true,
      verified: data.verified,
      data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'خطأ في فحص توثيق الدومين على فيرسل.',
    };
  }
};

/**
 * Real Vercel API: List all domains attached to this Vercel project
 */
export const listVercelProjectDomains = async (): Promise<{
  success: boolean;
  domains?: VercelDomainRecord[];
  error?: string;
}> => {
  const config = getActiveVercelConfig();
  if (!config.token || !config.projectId) {
    return {
      success: false,
      error: 'بيانات Vercel API غير مهيأة.',
    };
  }

  try {
    const url = getVercelApiUrl(
      `/v9/projects/${encodeURIComponent(config.projectId)}/domains`,
      config.teamId
    );

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error?.message || 'تعذر جلب دومينات المشروع من فيرسل.',
      };
    }

    return {
      success: true,
      domains: data.domains || [],
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'فشل الاتصال بـ Vercel.',
    };
  }
};

/**
 * Generate Vercel CLI command for quick terminal deployment
 */
export const getVercelCliAddCommand = (domain: string): string => {
  const clean = domain.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').trim();
  return `vercel domains add ${clean}`;
};
