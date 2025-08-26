# De-Health

De-Health is a modern medical record solution that utilizes blockchain technology to ensure transparency, security, and full control by users over their health data. With De-Health, users have the ability to record their medical history and maintain ownership of their data.

## Features

- **User Registration & Login:**
  Use Internet Computer principals to securely authenticate. It has a complete registration and login system with encrypted credentials.

- **Personal Health Records:**
  Users can create, view, edit, and delete their own health records. Each record includes:
  - Start and end date of illness
  - Symptoms
  - Optional diagnosis

- **Privacy & Security:**
  All data is stored immutably on the Internet Computer blockchain. Only the owner can access or modify their records.

- **Modern Frontend:**
  Built with React and Tailwind CSS for a responsive, fast, and user-friendly experience.

## Getting Started

### Prerequisites

Before you begin, make sure you have the following things installed:
- [Node.js](https://nodejs.org/) version 18 or higher.
- [DFINITY SDK (dfx)](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [mops](https://mops.one/) (Motoko package manager)

Check that all the tools are properly installed:

```sh
# Verify DFX installation
dfx --version

# Verify Node.js installation
node --version
npm --version
```

For detailed information about all the prerequisites, see the following documentation available online:

- [Internet Computer Developer Docs](https://internetcomputer.org/docs/home)
- [Motoko Programming Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Motoko Language Quick Reference](https://internetcomputer.org/docs/current/motoko/main/language-manual)


### 1. Clone the Repository

```sh
git clone https://github.com/ToExpert/hck-WCHL-2025.git
cd hck-WCHL-2025
```

### 2. Install Dependencies

```sh
# Install root dependencies
npm install

# Install frontend dependencies
cd src/pro_hackathon-react-frontend
npm install
cd ../..
```

### 3. Start the Local Internet Computer Replica

```sh
# Start in background 
dfx start --background
```

### 4. Deploy Canisters

```sh
# Deploy both frontend and backend canisters
dfx deploy

# Generate Candid interface declarations
dfx generate
```

### 5. Run the Frontend in Development Mode

```sh
cd src/pro_hackathon-react-frontend
npm start
```

Once the deployment process is complete, the application will be available at two URLs:

- The frontend will be available at: http://localhost:3000
- The backend canister runs at: http://localhost:4943/?canisterId={backend_canister_id}

## Usage
1. Register a new account with your principal, username, email, and password.
2. Login to access your dashboard.
3. Create new health records, specifying illness period, symptoms, and optional diagnosis.
4. Edit or delete your records at any time.

_All actions are securely tied to your Internet Computer identity._

## Frontend Development

The frontend is built using React and Tailwind CSS.

You can find the frontend code in [`src/pro_hackathon-react-frontend`](/src/pro_hackathon-react-frontend).

## Backend Development

The backend uses Motoko as the main language and Internet Identity.

You can find the backend code in [`src/pro_hackathon-react-backend`](/src/pro_hackathon-react-backend).

### Backend APIs (Motoko Canister)
For full type definitions and logic, see [`main.mo`](/src/pro_hackathon_backend/main.mo).
The backend exposes the following main functions:

- `register(username: Text, email: Text, password: Text)` - Register a new user.
- `login(username: Text, password: Text)` - Authenticate and return the user info.
- `createRecord(userName: Text, startDate: Int, endDate: ?Int, symptoms: Text, diagnosis: ?Text)` - Create a new health record.
- `getRecords()` - Get all records owned by the caller.
- `getRecordById(id: Nat)` - Get a specific record by ID (if owned by caller).
- `updateRecord(id: Nat, ...)` - Update a record (if owned by caller).
- `deleteRecord(id: Nat)` - Delete a record (if owned by caller).

## Contributing

Pull requests are welcome!

## External

This project has been submitted on [DoraHacks](https://dorahacks.io/). You can view the BUIDL for this project at: https://dorahacks.io/buidl/28745.

We also have videos available on YouTube for this project. These include a [demonstration video](https://youtu.be/cszbShnubJk) and a [pitch deck video](https://youtu.be/TXrJ3gP5Yno).

##  Acknowledgments
Built for the [WORLD COMPUTER HACKER LEAGUE 2025](https://disruptives.io/wchl25/).
Special thanks to the Internet Computer ecosystem and all members and contributors who made this project possible!