import type { Metadata } from 'next';
import SEOPageLayout from '@/components/layout/SEOPageLayout';
import Link from 'next/link';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://indonesianvisas.com';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isDefaultLocale = locale === 'en';
    
    // Canonical Strategy: English root always links to /services/China
    const canonicalUrl = isDefaultLocale ? `${APP_URL}/services/China` : `${APP_URL}/${locale}/services/China`;

    return {
        title: "2026年中国公民赴印度尼西亚签证官方中心 | GCI 全球公民计划",
        description: "为中国投资者和游客量身定制的赴印尼定居指南。官方电子落地签 (e-VoA)、商务签证 (B211A)、黄金签证及 GCI 归侨计划。",
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'x-default': `${APP_URL}/services/China`,
                'en': `${APP_URL}/services/China`,
                'id': `${APP_URL}/id/services/China`
            }
        }
    };
}

export default async function ChinaHubPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    const breadcrumbs = [
        { label: "Services", url: `/${locale}/services` },
        { label: "China Hub", url: `/${locale}/services/China` }
    ];

    const cta = {
        title: "准备从北京、上海或广州出发？",
        desc: "不要被繁琐的流程困扰。作为印尼官方法律中介，我们为中国公民提供 24 小时极速电子签证服务，助力您的投资或商务之旅。",
        buttonText: "立即开始签证申请",
        link: `/${locale}/apply`
    };

    const sections = [
        {
            id: "overview",
            title: "1. 2026年中国公民入境印度尼西亚规定",
            content: (
                <div className="space-y-4">
                    <p>持有中国护照（含因私护照）前往印度尼西亚的公民必须持有有效签证。印尼当前已实现全面的数字化入境管理。无论您是前往巴厘岛度假还是在雅加达进行商务投资，官方 e-VoA 是最快捷的入境选择。</p>
                </div>
            )
        },
        {
            id: "evoa",
            title: "2. e-VoA (B1) 电子落地签",
            content: (
                <div className="space-y-4">
                    <p>30 天电子落地签 (**e-VoA**) 允许中国游客在入境前在线申请。其最大优势是可以使用雅加达 (CGK) 和巴厘岛 (DPS) 机场的**自动通关闸机 (Autogates)**，大幅缩短排队时间。</p>
                </div>
            )
        },
        {
            id: "business",
            title: "3. 商务签证与投资 (B211A)",
            content: (
                <div className="space-y-4">
                    <p>对于在莫罗瓦利 (Morowali) 或苏拉威西进行工业投资的中国高管，**B211A 商务签证**提供初始 60 天的停留期，并在当地可延长至 180 天。我们提供完整的 PT PMA 法律代办服务。</p>
                </div>
            )
        },
        {
            id: "golden-visa",
            title: "4. 黄金签证与大额投资 (E31)",
            content: (
                <div className="space-y-4">
                    <p>针对高净值中国投资者，**印尼黄金签证**提供 5 至 10 年的长期居留权。申请人可通过购房或在该国开设 PT PMA 企业来获得此顶级身份。</p>
                </div>
            )
        },
        {
            id: "gci-track",
            title: "5. GCI 计划：归侨与后裔",
            content: (
                <div className="space-y-4">
                    <p>针对过去曾持有印尼公民身份的中国归侨及后代，**GCI (Global Citizen of Indonesia)** 计划提供永久居住和免批文工作的终身权利，助您回归祖籍地。</p>
                </div>
            )
        },
        {
            id: "passport",
            title: "6. 护照有效期要求",
            content: (
                <div className="space-y-4">
                    <p>前往印尼的中国公民护照必须具有 **至少 6 个月** 的有效期（从抵达日期算起）。不符合此要求的乘客将在值机柜台被拒绝登机。</p>
                </div>
            )
        },
        {
            id: "flights",
            title: "7. 往返中印官方航线",
            content: (
                <div className="space-y-4">
                    <p>中国国际航空、南方航空和厦门航空提供大量直飞航班。我们的签证系统与您的航司信息实时同步，确保顺利登机。</p>
                </div>
            )
        },
        {
            id: "customs",
            title: "8. 电子海关申报 (e-CD)",
            content: (
                <div className="space-y-4">
                    <p>根据 2026 最新要求，入境前 72 小时需在线填报电子海关单 (**e-CD**)。我们将协助您获取对应的申报二维码。</p>
                </div>
            )
        },
        {
            id: "overstay",
            title: "9. 逾期停留罚金提醒",
            content: (
                <div className="space-y-4">
                    <p>严禁签证到期后非法逗留。每逾期一天，罚金为 **1,000,000 印尼盾（约 460 人民币）**。如遇紧急情况，请务必提前联系我们办理延期。</p>
                </div>
            )
        },
        {
            id: "insurance",
            title: "10. 全球旅行保险与保障",
            content: (
                <div className="space-y-4">
                    <p>建议中国公民购买包含国际救援的商业医疗保险。雅加达与巴厘岛的顶级私立医院均认可大型中国保险公司的直付服务。</p>
                </div>
            )
        },
        {
            id: "idiv-infinity",
            title: "11. IDiv Infinity™ 身份认证系统",
            content: (
                <div className="space-y-4">
                    <p>购买我们服务的用户将获得特殊的金卡级别 IDiv 卡。这是您在印尼境内享受法律咨询优先服务和长期信用背书的象征。</p>
                </div>
            )
        },
        {
            id: "business-logistics",
            title: "12. 工业区商务支持",
            content: (
                <div className="space-y-4">
                    <p>我们为中资企业提供包括工作准证 (KITAS) 申办、本地雇员管理咨询和工业区实地法务调研在内的一站式支持。</p>
                </div>
            )
        },
        {
            id: "education",
            title: "13. 华裔子女教育咨询",
            content: (
                <div className="space-y-4">
                    <p>长期在雅加达或巴厘岛居住的中国家庭，可依托 **依赖签证 (Dependent KITAS)** 让子女就读当地的顶尖国际学校或华文补习机构。</p>
                </div>
            )
        },
        {
            id: "official-agency",
            title: "14. 为什么选择印尼签证官方中介？",
            content: (
                <div className="space-y-4">
                    <p>我们是持有 PT PMA 执照的正规法律中介，总部位于巴厘岛与雅加达。我们熟悉印尼海关的最新动态，确保中国客户的信息安全与合法合规。</p>
                </div>
            )
        },
        {
            id: "culture",
            title: "15. 印尼商事文化尊重",
            content: (
                <div className="space-y-4">
                    <p>在印尼经商需注重礼节。避免在大声公共场合争执。在签订商务合同前，建议寻找具有官方资质的中介进行前置尽调。</p>
                </div>
            )
        },
        {
            id: "faq",
            title: "16. 常见问题 (FAQ)",
            content: (
                <div className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <h4 className="font-bold text-primary mb-2">持落地签可以延期吗？</h4>
                        <p className="text-sm opacity-80">30 天的普通 e-VoA 可以在线延期一次 30 天，总计停留 60 天。如需更长停留，需申请 B211A 改签。</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <SEOPageLayout 
            title="印度尼西亚签证官方中心 - 中国 Hub"
            subtitle="印度尼西亚驻华法律实验室：全方位电子签证、商务准证、GCI 后代通道及大额投资居留方案。"
            breadcrumbs={breadcrumbs}
            sections={sections}
            locale={locale}
            cta={cta}
        />
    );
}
