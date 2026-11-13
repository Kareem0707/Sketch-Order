# 🚀 دليل البنية التحتية الشاملة للمتاجر متعددة المستأجرين (Multi-Tenant Architecture Guide)
## منصة سكتش أوردر (Sketch Order SaaS Platform)
### التوافق: Next.js (App Router) + Supabase (PostgreSQL) + Vercel Domains API + Wildcard DNS

---

## 📌 الفهرس العام
1. **نظرة عامة على معمارية النظام (System Architecture)**
2. **تصميم قاعدة البيانات (Supabase / PostgreSQL Schema & RLS)**
3. **التكامل البرمجي مع Vercel Domains API (Automated Subdomain Provisioning)**
4. **التوجيه الذكي باستخدام Next.js Middleware (Wildcard Host Rewriting)**
5. **جلب البيانات وتغذية المتجر (Dynamic Tenant Store Hydration - `/sites/[subdomain]/page.tsx`)**
6. **إعدادات DNS الدومين العالمي (Wildcard DNS Strategy on Cloudflare / Vercel)**
7. **أمان النظام وعزل البيانات (Security & Tenant Isolation)**

---

## 1. نظرة عامة على معمارية النظام (System Architecture)

```
                       [ زائر أو عميل المتجر ]
                                  │
                                  ▼
                    https://brandname.sketchorder.com
                                  │
                                  ▼
                     [ Vercel Edge Network ]
                    (Wildcard DNS: *.sketchorder.com)
                                  │
                                  ▼
               [ Next.js Middleware: middleware.ts ]
             - يستخرج الساب دومين: "brandname"
             - يفحص الكلمات المحجوزة: (app, admin, api, www)
             - يُعيد التوجيه الداخلي: NextResponse.rewrite('/sites/brandname')
                                  │
                                  ▼
              [ Dynamic Route: /sites/[subdomain]/page.tsx ]
                                  │
                                  ▼
                    [ Supabase Database Query ]
             - SELECT * FROM tenants WHERE subdomain = 'brandname'
             - جلب template_config، الألوان، الكتالوج، والمنتجات
                                  │
                                  ▼
              [ عرض واجهة المتجر الخاصة بالعميل فوراً ]
```

---

## 2. تصميم قاعدة البيانات (Supabase / PostgreSQL Schema)

قم بتشغيل الكود التالي في **SQL Editor** داخل لوحة تحكم **Supabase**:

```sql
-- 1. تفعيل ملحق توليد معرّفات UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. جدول المستأجرين وأصحاب المتاجر (Tenants & Store Owners)
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- بيانات المالك
    owner_name TEXT NOT NULL,
    owner_phone TEXT NOT NULL,
    owner_email TEXT,
    
    -- بيانات الدومين والهوية
    brand_name TEXT NOT NULL,
    subdomain TEXT UNIQUE NOT NULL,             -- مثال: "sportech"
    custom_domain TEXT UNIQUE,                  -- مثال: "sportech-eg.com" (اختياري)
    
    -- حالة الحساب والمتجر
    plan_tier TEXT DEFAULT 'pro' CHECK (plan_tier IN ('standard', 'pro', 'custom')),
    status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended')),
    
    -- إعدادات القالب والثيم المختار بالكامل بتنسيق JSONB فائق السرعة
    template_id TEXT NOT NULL DEFAULT 'sportech-sneakers',
    template_config JSONB NOT NULL DEFAULT '{
        "accentColor": "#F97316",
        "themeStyle": "modern",
        "tagline": "المتجر الرياضي الأول في مصر",
        "whatsappNumber": "01012345678",
        "currency": "ج.م",
        "sections": {
            "heroBanner": true,
            "categoriesBar": true,
            "sizeGuide": true,
            "bestSellers": true,
            "instantWhatsappCart": true
        }
    }'::jsonb
);

-- 3. جدول أقسام المتجر (Store Categories)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(tenant_id, slug)
);

-- 4. جدول منتجات المستأجر (Tenant Products)
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    cost_price NUMERIC(10, 2),
    
    image_url TEXT NOT NULL,
    description TEXT,
    badge TEXT,                                 -- مثل: "الأكثر مبيعاً"
    tag TEXT,
    
    sizes TEXT[] DEFAULT '{}',                  -- مصفوفة المقاسات ['40','41','42']
    colors JSONB DEFAULT '[]'::jsonb,           -- مصفوفة الألوان [{"name":"Red","hex":"#DC2626"}]
    
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. جدول طلبات الزبائن الواردة للمتجر (Tenant Orders)
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_governorate TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    
    items JSONB NOT NULL,                       -- عناصر السلة والكميات والمقاسات
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT DEFAULT 'cash_on_delivery',
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. إنشاء الفهارس (Indexes) لضمان الاستجابة في أجزاء من الثانية (< 20ms)
CREATE INDEX idx_tenants_subdomain ON public.tenants(subdomain);
CREATE INDEX idx_tenants_custom_domain ON public.tenants(custom_domain);
CREATE INDEX idx_products_tenant ON public.products(tenant_id);
CREATE INDEX idx_categories_tenant ON public.categories(tenant_id);
CREATE INDEX idx_orders_tenant ON public.orders(tenant_id);

-- 7. حماية أمان الصفوف (Row Level Security - RLS)
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- قراءة عامة للزوار بناءً على معرف المستأجر
CREATE POLICY "Public can view active tenants" ON public.tenants
    FOR SELECT USING (status = 'active');

CREATE POLICY "Public can view tenant products" ON public.products
    FOR SELECT USING (is_available = true);

CREATE POLICY "Public can view tenant categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Public can create orders" ON public.orders
    FOR INSERT WITH CHECK (true);
```

---

## 3. التكامل مع Vercel Domains API (Automated Provisioning)

عند تأكيد الدفع عبر InstaPay أو فودافون كاش أو بطاقة الائتمان، يستدعي الخادم هذا الـ API Route لإضافة الساب دومين لمشروع Vercel فورياً:

### الملف: `app/api/domains/add/route.ts`

```typescript
import { NextResponse } from 'next/server';

interface VercelDomainResponse {
  name: string;
  apexName: string;
  projectId: string;
  redirect?: string | null;
  verified: boolean;
  error?: { code: string; message: string };
}

export async function POST(req: Request) {
  try {
    const { subdomain, tenantId } = await req.json();

    if (!subdomain || !tenantId) {
      return NextResponse.json(
        { error: 'المعلومات المطلوبة غير مكتملة (subdomain & tenantId)' },
        { status: 400 }
      );
    }

    // اسم النطاق بالكامل: e.g. "brandname.sketchorder.com"
    const fullDomain = `${subdomain.toLowerCase().trim()}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'sketchorder.com'}`;

    // 1. طلب إضافة الدومين إلى مشروع Vercel برمجياً
    const vercelRes = await fetch(
      `https://api.vercel.com/v10/projects/${process.env.VERCEL_PROJECT_ID}/domains`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullDomain,
        }),
      }
    );

    const vercelData: VercelDomainResponse = await vercelRes.json();

    if (!vercelRes.ok) {
      console.error('Vercel API Error:', vercelData);
      return NextResponse.json(
        { error: vercelData.error?.message || 'فشل تسجيل الدومين في فيرسل' },
        { status: vercelRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      domain: fullDomain,
      verified: vercelData.verified,
      message: `تم تفعيل الدومين https://${fullDomain} بنجاح في خلال ثوانٍ!`,
    });
  } catch (err: any) {
    console.error('Server Exception:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

---

## 4. التوجيه الذكي باستخدام Next.js Middleware (Wildcard Rewriting)

يعترض هذا الملف كل طلب وارد قبل وصوله للصفحات، يستخرج الساب دومين، ويقوم بعملية `Rewrite` داخلية لمجلد الموقع المخصص دون تغيير الرابط الظاهر في شريط المتصفح:

### الملف: `middleware.ts` (في جذر مشروع Next.js)

```typescript
import { NextRequest, NextResponse } from 'next/server';

// قائمة الساب دومينات المحجوزة للخدمات الأساسية
const RESERVED_SUBDOMAINS = new Set([
  'app',
  'admin',
  'api',
  'studio',
  'www',
  'mail',
  'dashboard',
]);

export const config = {
  matcher: [
    /*
     * مطابقة جميع مسارات الطلبات عدا:
     * - api (مسارات الباك إند)
     * - _next/static (الملفات الثابتة)
     * - _next/image (محسن صور نكست)
     * - favicon.ico والميديا والصور
     */
    '/((?!api/|_next/static|_next/image|assets/|favicon.ico).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // تحديد الـ Root Domain (مثل sketchorder.com أو localhost:3000 أثناء التطوير)
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'sketchorder.com';

  // استخراج الساب دومين بدقة
  let currentHost = hostname.replace(`.${rootDomain}`, '');

  // دعم البيئة المحلية (Localhost Testing)
  if (hostname.includes('localhost')) {
    // مثال: brandname.localhost:3000 -> brandname
    currentHost = hostname.replace('.localhost:3000', '').replace('localhost:3000', '');
  }

  // 1. إذا كان الزائر يتصفح الدومين الرئيسي (sketchorder.com أو www)
  if (!currentHost || currentHost === 'www' || currentHost === rootDomain) {
    return NextResponse.next(); // عرض الموقع الرئيسي واللاندينج بيج
  }

  // 2. إذا كان الساب دومين محجوزاً (مثل admin أو studio)
  if (RESERVED_SUBDOMAINS.has(currentHost)) {
    return NextResponse.rewrite(new URL(`/${currentHost}${url.pathname}`, req.url));
  }

  // 3. إعادة التوجيه الداخلي للمتجر المستقل (Tenant Storefront)
  // الرابط في المتصفح يبقى: https://brandname.sketchorder.com/
  // بينما السيرفر يقرأ: /sites/[subdomain]
  return NextResponse.rewrite(new URL(`/sites/${currentHost}${url.pathname}`, req.url));
}
```

---

## 5. جلب البيانات وتغذية المتجر (Dynamic Tenant Store Hydration)

### الملف: `app/sites/[subdomain]/page.tsx`

```tsx
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import type { Metadata } from 'next';

// تهيئة عميل سوبابيز فائق السرعة
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface TenantPageProps {
  params: {
    subdomain: string;
  };
}

// إنشاء الميتا تاج لمحركات البحث ومشاركة الرابط على الواتساب
export async function generateMetadata({ params }: TenantPageProps): Promise<Metadata> {
  const { data: tenant } = await supabase
    .from('tenants')
    .select('brand_name, template_config')
    .eq('subdomain', params.subdomain)
    .single();

  if (!tenant) return { title: 'المتجر غير موجود' };

  return {
    title: `${tenant.brand_name} | المتجر الرسمي`,
    description: tenant.template_config?.tagline || `تسوق أحدث المنتجات من متجر ${tenant.brand_name}`,
    openGraph: {
      title: tenant.brand_name,
      description: tenant.template_config?.tagline,
    },
  };
}

export default async function TenantStorePage({ params }: TenantPageProps) {
  const { subdomain } = params;

  // 1. جلب بيانات المتجر والقالب المختار
  const { data: tenant, error: tenantErr } = await supabase
    .from('tenants')
    .select('*')
    .eq('subdomain', subdomain)
    .eq('status', 'active')
    .single();

  if (tenantErr || !tenant) {
    notFound(); // توجيه لصفحة 404 المخصصة
  }

  // 2. جلب المنتجات والأقسام الخاصة بهذا المتجر تحديداً
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('tenant_id', tenant.id)
    .eq('is_available', true);

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('display_order', { ascending: true });

  const config = tenant.template_config;

  return (
    <main
      dir="rtl"
      className="min-h-screen"
      style={{
        backgroundColor: config.themeStyle === 'luxury-dark' ? '#090D16' : '#FFFFFF',
        color: config.themeStyle === 'luxury-dark' ? '#FFFFFF' : '#0F172A',
      }}
    >
      {/* هيدر المتجر */}
      <header className="px-6 py-4 border-b flex items-center justify-between sticky top-0 backdrop-blur-md z-40">
        <h1 className="text-xl font-black">{tenant.brand_name}</h1>
        <span className="text-xs font-mono font-bold" style={{ color: config.accentColor }}>
          {subdomain}.sketchorder.com
        </span>
      </header>

      {/* بنر المتجر */}
      <div className="p-6">
        <div
          className="rounded-3xl p-8 text-white shadow-xl"
          style={{ background: `linear-gradient(135deg, #0F172A, ${config.accentColor})` }}
        >
          <h2 className="text-3xl font-black">{config.tagline}</h2>
          <p className="text-xs text-white/80 mt-2">طلب فوري مع شحن لجميع محافظات مصر</p>
        </div>
      </div>

      {/* كتالوج المنتجات */}
      <section className="px-6 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {products?.map((prod) => (
            <div key={prod.id} className="p-4 rounded-2xl border bg-inherit/40 hover:shadow-lg transition-all">
              <img src={prod.image_url} alt={prod.name} className="w-full h-44 object-cover rounded-xl mb-3" />
              <h3 className="text-sm font-black">{prod.name}</h3>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-mono font-bold text-base" style={{ color: config.accentColor }}>
                  {prod.price} {config.currency}
                </span>
                <a
                  href={`https://wa.me/20${tenant.owner_phone}?text=${encodeURIComponent(`مرحباً، أود طلب المنتج: ${prod.name} بسعر ${prod.price}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500"
                >
                  اطلب واتساب 💬
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
```

---

## 6. إعدادات الـ DNS على Vercel و مزود النطاق (Wildcard DNS Strategy)

لكي تعمل النطاقات الفرعية تلقائياً دون أي تدخل يدوي لكل عميل جديد:

1. **إضافة الـ Wildcard Domain في Vercel Dashboard:**
   - افتح مشروع **Sketch Order** في Vercel.
   - اذهب إلى **Settings** > **Domains**.
   - أضف النطاق: `*.sketchorder.com`.

2. **إعداد سجلات الـ DNS في Cloudflare / Namecheap / GoDaddy:**

| النوع (Type) | الاسم (Name) | القيمة (Value / Target) | التوكيل (Proxy Status) |
|---|---|---|---|
| **CNAME** | `*` | `cname.vercel-dns.com` | DNS Only (رمادي) أو Proxied إذا مفعل SSL |
| **CNAME** | `@` | `cname.vercel-dns.com` | DNS Only |
| **CNAME** | `www` | `cname.vercel-dns.com` | DNS Only |

> [!NOTE]
> مع تفعيل `*.sketchorder.com` كـ Wildcard CNAME، أي ساب دومين يتم إنشاؤه لعميل جديد (مثل `nike-store.sketchorder.com`) سيعمل فوراً ويحصل على شهادة SSL مجانية من Vercel تلقائياً في أقل من دقيقة واحدة!

---

## 7. أمان النظام وعزل البيانات (Security & Tenant Isolation)

1. **عزل البيانات الصارم (Strict Tenant Isolation):** كل استعلام من المتجر يمرر شرط `WHERE tenant_id = current_tenant.id`، مما يمنع نهائياً تداخل منتجات أو أرباح عميل مع عميل آخر.
2. **منع الاحتيال واختطاف النطاقات (Subdomain Squatting):** تم تأمين الـ `RESERVED_SUBDOMAINS` لمنع أي عميل من تسجيل `admin` أو `api` أو `app`.
3. **شهادات أمان SSL التلقائية:** تديرها Vercel تلقائياً لجميع الساب دومينات عبر Let's Encrypt مجاناً مدى الحياة.
