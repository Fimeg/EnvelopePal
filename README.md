# EnvelopePal 🦦

A smart envelope budgeting web application that helps you save money and reach your financial goals with style.

## Features

- 🎯 Smart envelope budgeting system with goal tracking
- 💫 Interactive progress visualization
- 🏆 Achievement system to celebrate milestones
- 📊 Transaction history with editable entries
- 📥 Import/Export functionality for envelope data
- 🎨 Multiple theme options (Green, Blue, Purple, Orange)
- 🦦 Friendly weasel mascot with savings tips
- 📱 Responsive design for all devices
- 🗄️ SQLite database for persistent storage
- 🐳 Docker support for easy deployment
- 🚀 RESTful API for all operations

## Getting Started

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/fimeg/envelopepal.git
cd envelopepal
```

2. Build and start the containers:
```bash
docker-compose up --build
```

3. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:5000/api

The application data will persist in the SQLite database located in the `backend/instance` directory.

### Manual Setup (Development)

1. Clone the repository:
```bash
git clone https://github.com/fimeg/envelopepal.git
cd envelopepal
```

2. Set up the backend:
```bash
cd backend
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
python run.py
```

3. Set up the frontend:
```bash
# In a new terminal
python -m http.server 80  # Or use any static file server
```

4. Access the application at http://localhost

## Usage

### Managing Envelopes

- Create envelopes with name and budget
- Add or subtract funds through transactions
- Track progress toward budget goals
- View transaction history
- Export envelope data to CSV
- Delete envelopes when no longer needed

### CSV Export Format

The CSV export includes the following columns:
```
Date,Type,Description,Amount,Balance
MM/DD/YYYY,deposit/withdrawal,"Transaction Name",00.00,00.00
```

## Architecture

### Frontend
- Static HTML/CSS/JavaScript
- Communicates with backend via RESTful API
- Theme customization with persistent preferences

### Backend
- Flask application with SQLite database
- RESTful API endpoints for all CRUD operations
- Models for Envelopes, Transactions, and Achievements

### Docker Configuration
- Frontend container with Nginx serving static files
- Backend container with Flask and SQLite
- Docker Compose for orchestration
- Persistent volume for SQLite database

## API Endpoints

### Envelopes
- GET `/api/envelopes` - List all envelopes
- POST `/api/envelopes` - Create new envelope
- PUT `/api/envelopes/<id>` - Update envelope
- DELETE `/api/envelopes/<id>` - Delete envelope

### Transactions
- GET `/api/envelopes/<id>/transactions` - List transactions for envelope
- POST `/api/envelopes/<id>/transactions` - Add transaction to envelope

### Achievements
- GET `/api/achievements` - List all achievements
- PUT `/api/achievements/<id>` - Update achievement

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Screenshot(s)
![Screenshot_20241226_230819](https://github.com/user-attachments/assets/67e93165-4ace-4276-9f7f-227ff26ce8f4)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Created by Casey Tunturi - Samaritan Solutions LLC

## Support

For support, please open an issue in the GitHub repository.
