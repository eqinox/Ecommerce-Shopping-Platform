# Next.js App

**Demo: [https://ecommerce-shopping-platform.vercel.app/](https://ecommerce-shopping-platform.vercel.app/)**

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Postgres](https://www.postgresql.org/) [(Neon.tech via Vercel)](https://neon.tech/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Payments**: [Stripe](https://stripe.com/) [Paypal](https://www.paypal.com/)
- **Authentication** [NextAuth.js](https://next-auth.js.org/) [Auth.js](https://authjs.dev/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)

## Features

- Marketing landing page (`/`) with latest products
- Search page with sort and filter for all products (`/search`)
- Cart page which lead to Stripe Checkout, Paypal Checkout or Cash on Delivery
- Admin dashboard (`/admin/`) with overview for all products, CRUD operations on products, orders and users
- Order history page
- User profile page
- RBAC with Admin and User roles
- Theme changing
- Notification by email when product is purchased
- Email/password authentication with JWTs stored to cookies

- The project uses **PostgreSQL**, hosted on **Neon.tech**, with seamless integration through **Vercel's managed database functionality**. This setup provides a scalable and serverless PostgreSQL experience optimized for modern applications.

After changes in `schema.prisma` file must run

```bash
npx prisma generate
```

to generate the Prisma client and the Prisma schema

Create the Migration

```bash
npx prisma migrate dev --name init
```

This will create a migration file in the `prisma/migrations`

Prisma comes with a built-in studio that we can use to view our database

```bash
npx prisma studio
```

Generate users and products if databae is empty

```bash
npx tsx ./src/db/seed
```

### Add environment variables

In your Vercel project settings (or during deployment), add all the necessary environment variables. Make sure to update the values for the production environment, including:

1. `NEXT_PUBLIC_SERVER_URL`: Set this to your production domain.
2. `STRIPE_SECRET_KEY`: Use your Stripe secret key.
3. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Use your Stripe public key
4. `STRIPE_WEBHOOK_SECRET`: Use the webhook secret from the production webhook you created in step 1.
5. `DATABASE_URL`: Set this to your postgres neondb database URL.
6. `NEXTAUTH_SECRET`: Set this to a random string. `openssl rand -base64 32` will generate one.
7. `NEXTAUTH_URL`: Set this to localhost or change it to the production url in step 1.
8. `NEXTAUTH_URL_INTERNAL`: Set this to the same as step 7
9. `PAYPAL_CLIENT_ID`: Paypal public key
10. `PAYPAL_APP_SECRET`: Paypal secret
11. `UPLOADTHING_TOKEN`: Uploadthing token
12. `UPLOADTHING_SECRET`: Uploadthing secret
13. `UPLOADTHING_APPID`: Uploadthing app id
14. `RESEND_API_KEY`: the key from resend for sending mails
