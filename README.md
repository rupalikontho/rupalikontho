# রূপালী কণ্ঠ — ওয়েবসাইট

বাংলাদেশের ইসলামী রেকর্ড লেবেল **রূপালী কণ্ঠ (Rupali Kontho)**-এর অফিশিয়াল ওয়েবসাইট — [rupalikontho.com](https://rupalikontho.com)

এটি একটি সাধারণ স্ট্যাটিক সাইট (HTML, CSS, JS)। কোনো বিল্ড বা সার্ভার লাগে না; GitHub Pages থেকে সরাসরি চলে।

## ফাইল

| ফাইল | কী আছে |
|---|---|
| `index.html` | পুরো পেজের লেখা ও কাঠামো |
| `assets/css/style.css` | রং, ফন্ট, লেআউট |
| `assets/js/config.js` | **ইউটিউব, ফেসবুক, ইমেইল, হোয়াটসঅ্যাপ, ফোন, ঠিকানা** |
| `assets/js/main.js` | মোবাইল মেনু ও লিংক বসানোর কোড |
| `lyrics.html` | লিরিক্স পেজ (rupalikontho.com/lyrics) |
| `assets/js/lyrics-data.js` | **গানের কথা** — নতুন গান এখানে যোগ করুন |
| `assets/js/lyrics.js` | লিরিক্স পেজের খোঁজা, বাছাই ও গান দেখানোর কোড |
| `assets/img/` | লোগো, ফেভিকন, শেয়ার ইমেজ, প্যাটার্ন |
| `CNAME` | কাস্টম ডোমেইন (rupalikontho.com) |

## লিংক ও যোগাযোগের তথ্য বদলানো

শুধু `assets/js/config.js` খুলে মানগুলো বসান। কোনো মান খালি (`""`) রাখলে সেই বাটন সাইটে দেখাবে না।

```js
window.SITE_CONFIG = {
  youtube: "https://www.youtube.com/@আপনার-চ্যানেল",
  facebook: "https://www.facebook.com/আপনার-পেজ",
  email: "info@rupalikontho.com",
  whatsapp: "8801XXXXXXXXX",
  phone: "+8801XXXXXXXXX",
  address: "আপনার ঠিকানা"
};
```

## লিরিক্সে নতুন গান যোগ করা

`assets/js/lyrics-data.js` খুলুন। ফাইলের উপরে একটা উদাহরণ দেওয়া আছে — সেটা কপি করে `window.LYRICS = [ ... ]`-এর ভেতরে বসান, তারপর গানের নাম, ধরন (হামদ/নাত/গজল/নাশীদ), শিল্পী, গীতিকার, সুরকার, ইউটিউব লিংক আর কথা লিখুন। একাধিক গান হলে প্রতিটির `}`-এর পরে কমা (`,`) দিন। প্রতিটি গানের নিজস্ব লিংক হবে `rupalikontho.com/lyrics#slug`।

## সর্বশেষ ইউটিউব ভিডিও যোগ করা

`index.html`-এ “সর্বশেষ ভিডিও যোগ করতে” লেখা কমেন্টটি খুঁজুন, ব্লকটি আনকমেন্ট করে `VIDEO_ID`-এর জায়গায় ভিডিওর আইডি বসান।

## ডোমেইন (Namecheap) সংযোগ

Namecheap → Domain List → rupalikontho.com → **Advanced DNS**-এ এই রেকর্ডগুলো রাখুন (পুরোনো `@` ও `www` রেকর্ড — যেমন URL Redirect বা Parking — মুছে দিন):

| Type | Host | Value |
|---|---|---|
| A Record | `@` | `185.199.108.153` |
| A Record | `@` | `185.199.109.153` |
| A Record | `@` | `185.199.110.153` |
| A Record | `@` | `185.199.111.153` |
| CNAME Record | `www` | `rupalikontho.github.io.` |

তারপর GitHub → এই রিপো → **Settings → Pages**: Source = `Deploy from a branch`, Branch = `main` / `(root)`। Custom domain-এ `rupalikontho.com` দেখাবে; DNS চালু হলে **Enforce HTTPS** টিক দিন।
