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
