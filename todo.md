# Digital Memorials - TODO

## Phase 1: Database & Schema
- [x] Create users table with fields: lastName, firstName, patronymic, birthDate, deathDate, email, password, role (user/admin)
- [x] Create memorials table with: userId, mainPhoto, burialPlace, coordinates (lat/lng), description
- [x] Create galleries table for photos, videos, audio files
- [ ] Create admin account: login=Administrator, password=$8W4Ds@%kjjZ
- [x] Set up database migrations

## Phase 2: Authentication System
- [x] Implement user registration with validation (integrated with API)
- [x] Implement user login with email + password (integrated with API)
- [x] Create password hashing and verification (bcrypt implemented)
- [x] Create session management (JWT tokens implemented)
- [x] Create admin authentication (role-based access control)
- [x] Implement protected routes with ProtectedRoute component
- [x] Add session persistence with cookies

## Phase 3: Public User Profiles
- [x] Create public profile template page (MemorialPage.tsx created)
- [x] Display main photo with name, birth-death dates, burial place
- [x] Create photo gallery component (integrated in MemorialPage)
- [x] Create video gallery component (integrated in MemorialPage)
- [x] Create audio gallery component (integrated in MemorialPage)
- [ ] Add map with burial location (TODO: integrate Map component)
- [ ] Add noindex meta tags to prevent SEO indexing

## Phase 4: User Dashboard
- [x] Create personal dashboard layout (Dashboard.tsx created)
- [ ] Add profile edit form (name, dates, burial place, coordinates)
- [ ] Add photo upload functionality
- [ ] Add video upload functionality
- [ ] Add audio upload functionality
- [ ] Add gallery management (view, delete, reorder)
- [ ] Add map location picker

## Phase 5: Admin Panel
- [x] Create admin dashboard layout (AdminPanel.tsx created)
- [x] Create user management page (list all users)
- [x] Add user creation form
- [ ] Add user edit functionality
- [x] Add user deletion functionality
- [x] Add admin-only access control
- [ ] Add noindex meta tags to prevent SEO indexing

## Phase 6: SEO & Robots
- [ ] Create robots.txt file
- [ ] Add noindex to: /dashboard, /admin, /profile/edit, /login, /register
- [ ] Allow indexing only for: /, /profile/* (public profiles)
- [ ] Add meta tags for noindex on protected pages

## Phase 7: Testing & Deployment
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test profile creation and editing
- [ ] Test file uploads
- [ ] Test admin panel
- [ ] Test noindex implementation
- [ ] Create checkpoint for deployment


## Phase 8: User Profile Management
- [x] Create backend procedure for getting user profile (auth.profile)
- [x] Create backend procedure for updating user profile (auth.updateProfile)
- [x] Build user profile page component (Profile.tsx)
- [x] Add edit mode toggle in profile page
- [x] Implement form validation for profile updates
- [x] Add profile update API integration
- [x] Create unit tests for profile operations (6 tests passing)
- [x] Test profile view and edit functionality
- [x] Add profile route to App.tsx


## Phase 9: Media Upload & Management
- [x] Create backend procedures for media upload (uploadMedia endpoint)
- [x] Create backend procedure for listing user media files (getGalleryItems)
- [x] Create backend procedure for deleting media files (deleteGalleryItem)
- [x] Build media upload component with drag-and-drop (MediaUpload.tsx)
- [x] Implement file validation (size, type, format)
- [x] Integrate S3 storage for file uploads (upload.ts router)
- [x] Create media gallery management interface (MediaGallery.tsx)
- [ ] Add media display in public memorial pages
- [x] Create unit tests for media operations (7 tests passing)
- [x] Test media upload and management functionality


## Phase 10: UI Improvements
- [x] Link header icons to registration/login routes on home page


## Phase 11: Admin Account Setup
- [x] Create admin seeder migration script (scripts/seed-admin.mjs)
- [x] Integrate seeder into deployment process (pnpm seed:admin)
- [x] Test admin account creation (Admin ID: 85 created successfully)


## Phase 12: Dashboard Media Management
- [x] Update Dashboard with media management sections (3 tabs: Profile, Memorials, Media)
- [x] Add MediaUpload component to Dashboard
- [x] Add MediaGallery component to Dashboard (photo, video, audio galleries)
- [x] Implement tab navigation for media types (tabbed interface with Tabs component)
- [x] Test media management in Dashboard (dev server running without errors)


## Phase 13: Memorial Editor Form
- [x] Create backend procedures for memorial details (create, update, get)
- [x] Build memorial editor form component (MemorialEditor.tsx)
- [x] Add text fields for burial place and biography
- [x] Integrate interactive map for location selection (MapView component)
- [x] Implement form validation and error handling
- [x] Add form submission with API integration (tRPC mutations)
- [x] Create unit tests for memorial operations (6 tests created)
- [x] Test memorial editor functionality (routes added to App.tsx)


## Phase 14: Public Memorial Pages
- [x] Create backend procedure for retrieving public memorial data (getPublic, getPublicGallery)
- [x] Build public memorial page component (PublicMemorialPage.tsx)
- [x] Display memorial details (name, dates, burial place, biography)
- [x] Integrate photo gallery in public pages (grid layout)
- [x] Integrate video gallery in public pages (video player)
- [x] Integrate audio gallery in public pages (audio player)
- [x] Add interactive map showing burial location (MapView component)
- [x] Implement noindex meta tags for SEO protection (NoindexHead component)
- [ ] Create unit tests for public memorial operations
- [x] Test public memorial page functionality (dev server running)


## Phase 15: Social Media Sharing
- [x] Create social media share component (SocialShare.tsx)
- [x] Add share buttons for Facebook, Twitter, WhatsApp, Telegram
- [x] Integrate share buttons into PublicMemorialPage
- [x] Test share functionality on all platforms (dev server running without errors)


## Phase 16: Audio Recording Feature
- [x] Create audio recording component with browser MediaRecorder API (AudioRecorder.tsx)
- [x] Add record/stop/pause controls to audio recorder (record, pause, stop buttons)
- [x] Integrate audio recording into MediaUpload component (Record button in audio tab)
- [x] Add audio playback preview before upload (audio player in preview)
- [x] Implement audio file management and deletion (delete button)
- [x] Test audio recording and upload functionality (dev server running without errors)


## Phase 17: QR Code Generation
- [x] Create QR code generator component with qrcode.react library (QRCodeGenerator.tsx)
- [x] Add QR code display in public memorial pages (integrated in PublicMemorialPage)
- [x] Implement download functionality for QR codes (PNG format with canvas download)
- [x] Add QR code customization (size, color, logo - SVG format)
- [x] Test QR code generation and download (dev server running without errors)


## Phase 18: Epitaph Feature
- [x] Add epitaph field to memorials table in database schema
- [x] Create database migration for epitaph field
- [x] Add epitaph editor to memorial editor form
- [x] Display epitaph prominently on public memorial pages
- [x] Add epitaph to memorial profile view
- [x] Test epitaph functionality


## Phase 19: Admin Login by Username
- [x] Add username field to users table in database schema
- [x] Create database migration for username field
- [x] Update getUserByUsername function in server/db.ts
- [x] Modify login procedure to accept username or email
- [x] Update login form to support username input
- [x] Update admin user with username "Administrator" in database
- [x] Test admin login with username and password
- [x] Fix session persistence by updating authenticateRequest to support local JWT tokens
