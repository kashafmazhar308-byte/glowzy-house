GLOWZY HOUSE ADMIN PANEL

Files:
- admin.html
- css/admin.css
- js/admin.js
- supabase-schema.sql

SETUP

1. Create a Supabase project.
2. Open SQL Editor and run supabase-schema.sql.
3. Create an Authentication user for yourself in Supabase.
4. Copy that user's UUID.
5. Insert the UUID into admin_users:

   insert into public.admin_users (user_id)
   values ('YOUR_AUTH_USER_UUID');

6. In js/admin.js replace:
   PASTE_YOUR_SUPABASE_URL_HERE
   PASTE_YOUR_SUPABASE_ANON_KEY_HERE

7. Put the files in your website:
   admin.html -> project root
   admin.css -> css/admin.css
   admin.js -> js/admin.js
   supabase-schema.sql -> keep outside the public site if you prefer

IMPORTANT
Use only the Supabase anon/publishable key in browser code.
Never put the Supabase service_role/secret key in HTML or JS.

The dashboard handles:
- Admin login
- Product add/edit/delete
- Product active/inactive
- Orders list + status
- Gift inquiries list + status
- Dashboard counts
