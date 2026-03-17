@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 34 33% 95%;
    --foreground: 0 0% 18%;

    --card: 0 0% 100%;
    --card-foreground: 0 0% 18%;

    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 18%;

    --primary: 157 22% 39%;
    --primary-foreground: 0 0% 100%;

    --primary-dark: 157 33% 28%;

    --secondary: 40 100% 98%;
    --secondary-foreground: 0 0% 18%;

    --muted: 34 20% 92%;
    --muted-foreground: 0 0% 42%;

    --accent: 43 64% 52%;
    --accent-foreground: 0 0% 100%;

    --destructive: 43 64% 52%;
    --destructive-foreground: 0 0% 100%;

    --border: 34 20% 88%;
    --input: 34 20% 88%;
    --ring: 157 22% 39%;

    --radius: 0.5rem;

    --sidebar-background: 0 0% 100%;
    --sidebar-foreground: 0 0% 18%;
    --sidebar-primary: 157 22% 39%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 34 20% 95%;
    --sidebar-accent-foreground: 0 0% 18%;
    --sidebar-border: 34 20% 90%;
    --sidebar-ring: 157 22% 39%;

    --shadow-card: 0 0 0 1px rgba(79, 122, 106, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
    --shadow-elevated: 0 0 0 1px rgba(79, 122, 106, 0.05), 0 4px 6px rgba(0, 0, 0, 0.02);
    --shadow-hover: 0 8px 24px rgba(79, 122, 106, 0.12);
    --glow-accent: 0 0 40px rgba(212, 175, 55, 0.1);
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-family: 'Inter', sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', sans-serif;
    @apply font-semibold tracking-tight;
  }
}

@layer components {
  .glass-card {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    box-shadow: var(--shadow-elevated);
  }

  .card-shadow {
    box-shadow: var(--shadow-card);
  }

  .card-hover {
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }

  .card-hover:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-2px);
  }

  .glow-accent {
    box-shadow: var(--glow-accent);
  }
}
