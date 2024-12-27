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
- 💾 Local storage for data persistence
- 🚀 Quick-add categories with recommended goals

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/fimeg/envelopepal.git
cd envelopepal
```

2. Open `index.html` in your web browser to start using EnvelopePal.

No build process or dependencies required! EnvelopePal runs entirely in the browser using vanilla JavaScript.

OR: 

1. Clone the repository:
```bash
git clone https://github.com/fimeg/envelopepal.git
cd envelopepal
```

2. Start a local development server:
```bash
npm install
npm start
```

This will start a local server at `http://localhost:3000`


## Usage

### Creating Envelopes

1. Use the quick-add buttons for common categories, or
2. Create a custom envelope by entering:
   - Envelope name
   - Starting amount
   - Target goal amount

### Managing Envelopes

- Add or subtract funds from each envelope
- Track progress toward savings goals
- View and edit transaction history
- Export envelope data to CSV
- Delete envelopes when no longer needed

### CSV Import/Export Format

#### Export Format
The CSV export includes the following columns:
```
Date,Type,Name,Amount,Balance
MM/DD/YYYY,deposit/withdrawal,"Transaction Name",00.00,00.00
```

#### Import Format
To import an envelope, create a CSV file with these columns:
```
Date,Type,Name,Amount
MM/DD/YYYY,deposit/withdrawal,"Transaction Name",00.00
```

## Local Storage

EnvelopePal uses browser local storage to save:
- Envelope data
- Transaction history
- Achievements
- Theme preference

No server or database required!

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
