# Security Specification — Campusia (Gestion des étudiants)

## 1. Data Invariants
1. Every document in `/students/{studentId}` must belong to an authenticated, email-verified user (`ownerId == request.auth.uid`), or be accessed by the verified bootstrap administrator.
2. Document IDs (`studentId`) must match `^[a-zA-Z0-9_\-]+$` and be at most 128 characters.
3. All required fields (`matricule`, `firstName`, `lastName`, `email`, `phone`, `program`, `level`, `status`, `gpa`, `birthDate`, `enrollmentYear`, `address`, `notes`, `ownerId`, `createdAt`, `updatedAt`) must be present and strictly typed; no shadow/extra keys are permitted.
4. `ownerId` and `createdAt` are immutable after creation; `createdAt` (on create) and `updatedAt` (on create/update) must equal `request.time`.
5. `gpa` must be a number in `[0, 20]` and `enrollmentYear` must be an int in `[2000, 2035]`.
6. PII fields (`email`, `phone`, `address`) are never readable via unauthenticated requests or non-owner accounts (`allow get` and `allow list` both enforce `ownerId == request.auth.uid || isAdmin()`).

## 2. The "Dirty Dozen" Adversarial Payloads
1. Unauthenticated read or write to `/students/stu-1`.
2. Authenticated user with `email_verified: false` attempting `create` or `get`.
3. Identity spoofing: `create` with `ownerId: "other-user-uid"`.
4. Shadow field injection: `create` or `update` adding `isVerified: true` or `role: "admin"`.
5. Missing required field: `create` omitting `matricule` or `email`.
6. Oversized string DoS: `notes` > 1000 characters or `firstName` > 80 characters.
7. Invalid `studentId` path variable (e.g., 200-char string or spaces/dots).
8. Out-of-bounds numeric value: `gpa: 25` or `gpa: -2` or `enrollmentYear: 1800`.
9. Invalid enum value: `status: "SuperAdmin"` or `program: "Unknown"`.
10. Timestamp tampering: `create` with client-forged `createdAt` != `request.time`.
11. Immutable field mutation: `update` changing `ownerId` or `createdAt`.
12. Cross-tenant PII leak: User B calling `get` or `list` on User A's `/students/{studentId}`.
