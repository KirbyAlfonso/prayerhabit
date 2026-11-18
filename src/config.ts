// Edit these values. Blank contact fields are hidden on the Contact page.
export const SITE = {
  name: 'Prayer Habit',
  url: 'https://prayerhabit.com',
  tagline:
    'PrayerHabit is an independent Christian ministry encouraging daily communion with God through scripture, reflection, and prayer archives.',
  email: '',   // e.g. 'hello@prayerhabit.com'
  phone: '',   // e.g. '+63 900 000 0000'
  address: 'Pasig City, Metro Manila, Philippines', // e.g. 'Marikina City, Philippines'
};

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Gallery', href: '/gallery/' },
  { label: 'Contact Us', href: '/contact-us/' },
];

// To add gallery images: drop the file in public/images/ and add a line here.
export const GALLERY = [
  { src: '/images/prayer_manuscript_morning_1894.webp', alt: 'Handwritten morning prayer manuscript, 1894' },
  { src: '/images/prayer_manuscript_evening_1922.webp', alt: 'Handwritten evening prayer manuscript, 1922' },
  { src: '/images/prayer_manuscript_endurance_1908.webp', alt: 'Handwritten prayer of endurance, 1908' },
];
