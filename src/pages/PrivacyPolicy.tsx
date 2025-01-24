import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

export default function PrivacyPolicy() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h3" gutterBottom>
          🔒 Privacy Policy
        </Typography>
        
        <Typography variant="body1" paragraph>
          Last updated: January 24, 2025
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          1. 📊 Information Collection
        </Typography>
        <Typography variant="body1" paragraph>
          We collect information to provide better services to our users. This includes:
          • Usage data for improving our tools
          • Technical information for optimization
          • Cookies and similar technologies
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          2. 🎯 Google AdSense
        </Typography>
        <Typography variant="body1" paragraph>
          We use Google AdSense to display advertisements. Google AdSense may use cookies and web beacons to:
          • Serve personalized ads
          • Track ad performance
          • Prevent fraudulent activity
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          3. 🔐 Data Security
        </Typography>
        <Typography variant="body1" paragraph>
          We implement security measures to protect your data:
          • Encryption of sensitive information
          • Regular security assessments
          • Limited data access
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          4. 📱 Third-Party Services
        </Typography>
        <Typography variant="body1" paragraph>
          Our website integrates with third-party services:
          • Google AdSense for advertising
          • Analytics tools for performance monitoring
          • Security services for protection
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          5. 🌐 Cookie Policy
        </Typography>
        <Typography variant="body1" paragraph>
          We use cookies to:
          • Improve user experience
          • Analyze site traffic
          • Personalize content and ads
          • Remember user preferences
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          6. ✉️ Communications
        </Typography>
        <Typography variant="body1" paragraph>
          We may contact you regarding:
          • Service updates
          • Security notifications
          • Technical announcements
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          7. 📋 Your Rights
        </Typography>
        <Typography variant="body1" paragraph>
          You have the right to:
          • Access your data
          • Request data deletion
          • Opt-out of communications
          • Control cookie preferences
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          8. 🔄 Policy Updates
        </Typography>
        <Typography variant="body1" paragraph>
          We may update this policy periodically. Users will be notified of significant changes.
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          For questions about this Privacy Policy, please contact us through our Contact page.
        </Typography>
      </Paper>
    </Container>
  );
}
