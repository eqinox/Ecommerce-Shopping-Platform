# Next.js App

**Demo: [https://ecommerce-shopping-platform.vercel.app/](https://ecommerce-shopping-platform.vercel.app/)**

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Database**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Payments**: [Stripe](https://stripe.com/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/)

## Features

- Marketing landing page (`/`) with latest products
- Search page with all products (`/search`) which leads to Stripe Checkout
- Admin dashboard with CRUD operations on products
- RBAC with Admin and User roles
- Email/password authentication with JWTs stored to cookies

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
9. `ENCRYPTION_KEY`: Set this to a random string. `openssl rand -base64 32` will generate one.
10. `PAYPAL_CLIENT_ID`: Paypal public key
11. `PAYPAL_APP_SECRET`: Paypal secret
12. `UPLOADTHING_TOKEN`: Uploadthing token
13. `UPLOADTHING_SECRET`: Uploadthing secret
14. `UPLOADTHING_APPID`: Uploadthing app id
15. `RESEND_API_KEY`: the key from resend for sending mails
