"""
Bulk-create test user accounts via the backend's existing /auth/register endpoint.

Usage:
    pip install requests
    python seed_users.py

Adjust BASE_URL and COUNT below as needed. Safe to re-run: accounts that
already exist (duplicate email) are skipped, not duplicated or errored on.
"""

import requests

BASE_URL = "http://localhost:8000"
COUNT = 50
PASSWORD = "testpass123"  # same password for every test account, for convenience
EMAIL_DOMAIN = "example.com"


def register_user(name: str, email: str, password: str) -> dict | None:
    resp = requests.post(
        f"{BASE_URL}/auth/register",
        json={"name": name, "email": email, "password": password},
    )
    if resp.status_code == 201:
        return resp.json()
    if resp.status_code == 400 and "already registered" in resp.text:
        print(f"  skip (already exists): {email}")
        return None
    print(f"  FAILED ({resp.status_code}): {email} -> {resp.text}")
    return None


def main():
    created = []
    for i in range(1, COUNT + 1):
        name = f"Test User {i:02d}"
        email = f"testuser{i:02d}@{EMAIL_DOMAIN}"
        print(f"[{i}/{COUNT}] Registering {email} ...")
        user = register_user(name, email, PASSWORD)
        if user:
            created.append(user)

    print()
    print(f"Done. Created {len(created)} new accounts (out of {COUNT} requested).")
    print(f"All accounts use password: {PASSWORD}")

    if created:
        print()
        print("Sample created accounts:")
        for u in created[:5]:
            print(f"  {u['email']}  (id: {u['id']}, code: {u.get('user_code', 'n/a')})")
        if len(created) > 5:
            print(f"  ... and {len(created) - 5} more")


if __name__ == "__main__":
    main()