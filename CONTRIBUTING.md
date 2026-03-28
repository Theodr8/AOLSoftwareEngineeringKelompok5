# Contributing Guidelines

Welcome to the team! To ensure we move fast without breaking the main application, please follow this workflow for all new features and bug fixes.

## 1. Branching Strategy
We strictly use a feature-branch workflow. **Do not push directly to `main`.**

When starting a new task, branch off of `main` using the following naming convention:
* `feature/short-description` (e.g., `feature/user-login-ui`)
* `bugfix/short-description` (e.g., `bugfix/header-alignment`)
* `chore/short-description` (e.g., `chore/update-dependencies`)

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

## 2. Development Rules
* **Component Structure**: Keep React components small and modular.
* **Database**: Do not manually edit the database schema. If you need to change a table, you must write a migration script.

## 3. Commit Messages
Write clear, concise commit messages so we can track the history easily.
* **Good**: feat: add email validation to registration form
* **Bad**: fixed stuff

## 4. Pull Request (PR) Process
When your feature is complete and tested locally:
1. Push your branch to Github: ```git push origin feature/your-feature-name```.
2. Open a Pull Request against the ```main``` branch.
3. In the PR description, clearly explain what you built and how to test it.
4. **Review**: At least ONE other team member must review and approve your code before it can be merged.
5.  Once approved, you may squash and merge your feature into ```main```.

## 5. Staying updated
``` bash
git checkout main
git pull origin main
```