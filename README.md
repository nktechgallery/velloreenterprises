# 🔥 Vellore Enterprises – Fire Safety Website

A premium Next.js 14 fire safety company website for Vellore Enterprises, featuring a 3D hero section, product catalog, AMC request system, and Firebase integration.

---

## 📁 Project Structure

```
vellore-enterprises/
├── app/
│   ├── globals.css          # Global styles, Tailwind, custom CSS
│   ├── layout.js            # Root layout with Navbar, Footer, Providers
│   ├── page.js              # Homepage (Hero, Services, PASS Method, CTA)
│   ├── products/page.js     # Products catalog with cart
│   ├── amc/page.js          # AMC request form
│   ├── about/page.js        # About us page
│   └── contact/page.js      # Contact form
├── components/
│   ├── Navbar.js            # Sticky navbar with mobile menu + cart
│   ├── CartDrawer.js        # Slide-in inquiry cart
│   ├── Hero3D.js            # Three.js 3D fire extinguisher
│   ├── PassMethod.js        # Interactive PASS method section
│   ├── Footer.js            # Footer with links & contact
│   └── WhatsAppFloat.js     # Floating WhatsApp button
├── context/
│   └── CartContext.js       # Cart state management
├── lib/
│   └── firebase.js          # Firebase configuration
├── public/
│   └── robots.txt
├── .env.local.example       # Environment variables template
├── next.config.mjs
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## ⚡ Quick Setup (5 Steps)

### Step 1 — Install Node.js
Make sure you have **Node.js 18.17+** installed.
- Download from: https://nodejs.org
- Verify: `node -v` (should show v18 or higher)

### Step 2 — Install Dependencies
Open terminal in the project folder and run:
```bash
npm install
```
This installs all packages (Next.js, Three.js, Firebase, etc.). Takes 1–2 minutes.

### Step 3 — Set Up Firebase (Optional but Recommended)
The site works without Firebase (falls back to WhatsApp for forms), but for full functionality:

1. Go to https://console.firebase.google.com
2. Create a new project (e.g., `vellore-enterprises`)
3. Add a **Web App** to the project
4. Copy the config values
5. Enable **Firestore Database** (start in test mode initially)
6. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
7. Fill in your Firebase values in `.env.local`

**If you skip Firebase:** Forms will automatically redirect to WhatsApp instead — fully functional!

### Step 4 — Run the Development Server
```bash
npm run dev
```
Open http://localhost:3000 in your browser. 🎉

### Step 5 — Build for Production
```bash
npm run build
npm start
```

---

## 🌐 Deployment to Vercel (Recommended — Free)

1. Push your code to GitHub
2. Go to https://vercel.com and sign in
3. Click **"New Project"** → Import your GitHub repo
4. In **Environment Variables**, add all your Firebase keys from `.env.local`
5. Click **Deploy** — your site is live in ~2 minutes!
6. Add your custom domain `velloreenterprises.in` in Vercel dashboard

---

## 🔥 Firebase Firestore Collections

When customers submit forms, data is saved to these collections:

| Collection | Triggered by | Fields |
|---|---|---|
| `contact_enquiries` | Contact form | name, phone, email, subject, message |
| `amc_requests` | AMC form | companyName, contactPerson, phone, email, location, systemType, details |
| `products` | Admin panel | name, code, category, description, features, image, slug, featured |

**Firestore Security Rules** (paste in Firebase Console → Firestore → Rules):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public write to enquiry collections
    match /contact_enquiries/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    match /amc_requests/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    // Products: public read, authenticated write
    match /products/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🎨 Customisation

### Change Contact Details
Search and replace `918072264972` with your WhatsApp number in all files.
Search and replace `velloreenterprises7@gmail.com` with your email.

### Change Address
Edit `components/Footer.js` → find the address section.

### Add Real Product Images
In `app/products/page.js`, update the `defaultProducts` array — add an `image` field with a URL:
```js
{ id: '1', name: '...', image: 'https://your-image-url.jpg', ... }
```
Or upload products via Firebase Console → Firestore → `products` collection.

### Add a 3D Model
Place a `fire.glb` file in the `public/` folder. The Hero3D component will automatically use it. If no file is found, the procedural fallback model is shown.

### Update SEO
Edit `app/layout.js` → `metadata` object — update title, description, keywords, OG image.

---

## 📞 Support
- Phone: +91 80722 64972
- Email: velloreenterprises7@gmail.com

---

*Built with Next.js 14, Three.js, Firebase, and Tailwind CSS*
