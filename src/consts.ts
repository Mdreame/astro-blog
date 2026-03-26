import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'mdreame',
  description:
    '百龄影徂，千载心在。',
  href: 'https://blog.mdreame.space',
  author: 'mdreame',
  locale: 'zh-CN',
  featuredPostCount: 3,
  postsPerPage: 10,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog',
  },
  // {
  //   href: '/authors',
  //   label: 'authors',
  // },
  // {
  //   href: '/photos',
  //   label: 'photos',
  // },
  // {
  //   href: '/about',
  //   label: 'about',
  // },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://t.me/himdreame',
    label: 'Telegram',
  },
  {
    href: 'https://twitter.com/mdreame_xu',
    label: 'Twitter',
  },
  {
    href: 'mailto:mdreame@qq.com',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Telegram: 'lucide:send',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}
