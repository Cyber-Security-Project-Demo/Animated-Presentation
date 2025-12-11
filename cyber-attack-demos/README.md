# Cyber Attack Demos - Educational Tool

An interactive educational application that demonstrates 5 common cyber attack types through animated presentations. Designed to help non-technical users understand cybersecurity vulnerabilities in an engaging and easy-to-understand way.

## 🎯 Attack Types Covered

### 1. SQL Injection
- Shows how malicious code can trick databases into revealing secrets
- Demonstrates the difference between normal login and injection attacks
- Includes protection mechanisms

### 2. Cross-Site Scripting (XSS)
- Illustrates how bad scripts can steal information from websites
- Shows the progression from normal search to malicious script execution
- Demonstrates how protection shields work

### 3. Insecure Direct Object Reference (IDOR)
- Explains how changing numbers in URLs can access other people's data
- Shows the vulnerability of trusting user input without proper authorization
- Demonstrates proper access control

### 4. Cross-Site Request Forgery (CSRF)
- Shows how fake buttons can make actions without user permission
- Demonstrates automatic cookie transmission and forged requests
- Explains CSRF token protection

### 5. Command Injection
- Shows how search boxes can be tricked into deleting entire databases
- Demonstrates the catastrophic impact of unvalidated input
- Shows input validation and sanitization protection

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone or download this project
2. Navigate to the project directory:
   ```bash
   cd cyber-attack-demos
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎮 How to Use

1. **Main Menu**: Choose from 5 different attack types
2. **Interactive Demos**: Each demo runs automatically with visual animations
3. **Controls**: Use Play/Pause and Reset buttons to control the demonstration
4. **Educational Content**: Each stage includes explanations suitable for non-technical audiences

## 🛡️ Safety Features

- **Educational Only**: All demonstrations are safe simulations
- **No Real Vulnerabilities**: No actual security risks are created
- **Clear Warnings**: Prominent disclaimers about ethical use
- **Protection Examples**: Shows how to defend against each attack type

## 🎨 Design Philosophy

- **User-Friendly**: Designed for non-technical audiences
- **Visual Learning**: Animated demonstrations make complex concepts clear
- **Engaging**: Interactive elements keep users interested
- **Comprehensive**: Covers both attack methods and protection strategies

## 🔧 Technical Stack

- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Responsive styling
- **Vite** - Fast development and building
- **Lucide React** - Beautiful icons

## 📁 Project Structure

```
cyber-attack-demos/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── AttackSelector.tsx
│   ├── demos/              # Individual attack demonstrations
│   │   ├── SQLInjectionDemo.tsx
│   │   ├── XSSDemo.tsx
│   │   ├── IDORDemo.tsx
│   │   ├── CSRFDemo.tsx
│   │   └── CommandInjectionDemo.tsx
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## ⚠️ Important Disclaimers

- **Educational Purpose Only**: This tool is designed for learning about cybersecurity
- **No Real Attacks**: All demonstrations are simulated and safe
- **Ethical Use**: Never attempt these techniques on real systems without permission
- **Legal Compliance**: Always follow applicable laws and regulations
- **Responsible Disclosure**: Report real vulnerabilities through proper channels

## 🤝 Contributing

This is an educational project. If you'd like to contribute:

1. Ensure all content remains educational and ethical
2. Maintain the user-friendly, non-technical approach
3. Add proper safety warnings to any new content
4. Test thoroughly to ensure no real security risks

## 📝 License

This project is intended for educational purposes. Please use responsibly and ethically.

## 🆘 Support

If you encounter any issues or have questions about cybersecurity education, please refer to reputable cybersecurity resources and educational institutions.

---

**Remember: With great knowledge comes great responsibility. Use this information to protect, not to harm.**