"use client";

import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Navbar } from '@/components/layout/Navbar';


// 1. Définition du thème sportif/énergétique
type AppTheme = {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    light: string;
    dark: string;
    background: string;
    energy: string;
    power: string;
  };
  gradients: {
    sport: string;
    energy: string;
  };
};

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}

// Nouveau thème dynamique
const theme: AppTheme = {
  colors: {
    primary: '#2563eb',     // Bleu vif
    secondary: '#059669',   // Vert énergique
    accent: '#dc2626',      // Rouge intense
    light: '#f8fafc',       // Fond très clair
    dark: '#1e293b',        // Texte foncé
    background: '#f1f5f9',  // Fond légèrement grisé
    energy: '#f59e0b',      // Orange énergique
    power: '#7c3aed'        // Violet puissant
  },
  gradients: {
    sport: 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
    energy: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)'
  }
};

// 2. Composants stylisés
const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  padding-top: 80px; /* Espace fixe pour la navbar */
`;

const HeroSection = styled.section`
  height: 60vh;
  min-height: 500px;
  background: ${({ theme }) => theme.gradients.sport};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
  padding: 2rem;
  position: relative;
  margin-top: -80px; /* Compensation navbar */
  padding-top: 120px; /* Espace supplémentaire */

  &::after {
    content: '';
    position: absolute;
    bottom: -50px;
    left: 0;
    right: 0;
    height: 100px;
    background: ${({ theme }) => theme.colors.background};
    transform: skewY(-3deg);
    z-index: 1;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  max-width: 800px;
  margin-bottom: 2rem;
  z-index: 2;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 2;
  font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
`;

const OpeningHours = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  color: ${({ theme }) => theme.colors.dark};
  font-size: 1.2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div<{ variant: keyof AppTheme['colors'] }>`
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
  cursor: pointer;
  border-left: 6px solid ${({ variant, theme }) => theme.colors[variant]};
  background: white;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.dark};
`;

const PhoneNumber = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 1.5rem 0;
  display: block;
  color: ${({ theme }) => theme.colors.primary};
`;

const ActionButton = styled.div`
  margin-top: 2rem;
  text-align: right;
`;

const ActionLink = styled.a<{ variant: keyof AppTheme['colors'] }>`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ variant, theme }) => theme.colors[variant]};
  background-color: ${({ variant, theme }) => `${theme.colors[variant]}15`};
  cursor: pointer;

  &:hover {
    background-color: ${({ variant, theme }) => `${theme.colors[variant]}30`};
    transform: translateX(5px);
  }
`;

const FreeShipping = styled.div`
  text-align: center;
  margin: 4rem 0;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
`;

const ShippingLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 900;
  text-decoration: none;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  border-radius: 8px;
  background-color: ${({ theme }) => `${theme.colors.primary}10`};

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
    background-color: ${({ theme }) => `${theme.colors.primary}20`};
    transform: scale(1.05);
  }
`;

const Footer = styled.footer`
  background: ${({ theme }) => theme.colors.dark};
  color: white;
  padding: 4rem 0 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const FooterLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
`;

const FooterColumn = styled.div``;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.light};
`;

const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterListItem = styled.li`
  margin-bottom: 1rem;
`;

const FooterLink = styled.a`
  color: #a0aec0;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 1rem;
  display: inline-block;

  &:hover {
    color: white;
    transform: translateX(5px);
  }
`;

const Copyright = styled.p`
  text-align: center;
  margin-top: 3rem;
  color: #718096;
  font-size: 0.9rem;
  padding-top: 2rem;
  border-top: 1px solid #2d3748;
`;

// 3. Définition du type pour les cartes
type ContactCard = {
  id: number;
  title: string;
  content: React.ReactNode;
  actionText: string;
  actionLink: string;
  variant: keyof AppTheme['colors'];
  onClick?: () => void;
};

const ContactService = () => {
  const handleAction = (link: string) => {
    if (link.startsWith('tel:')) {
      window.location.href = link;
      return;
    }
    
    if (link.includes('wa.me')) {
      window.open(link, '_blank');
      return;
    }
    
    if (link.startsWith('mailto:')) {
      window.location.href = link;
      return;
    }
    
    window.open(link, '_blank');
  };

  const cards: ContactCard[] = [
    {
      id: 1,
      title: "APPELEZ-NOUS",
      content: <PhoneNumber>+33 1 86 15 31 35</PhoneNumber>,
      actionText: "APPEL IMMÉDIAT",
      actionLink: "tel:+33186153135",
      variant: 'primary'
    },
    {
      id: 2,
      title: "MESSAGERIE FACEBOOK",
      content: "Contactez notre équipe via Messenger pour une réponse rapide",
      actionText: "OUVRIR MESSENGER",
      actionLink: "https://m.me/fitcoachia",
      variant: 'secondary'
    },
    {
      id: 3,
      title: "SUPPORT PAR EMAIL",
      content: "Nous répondons sous 24h à vos questions techniques",
      actionText: "ENVOYER UN EMAIL",
      actionLink: "mailto:support@fitcoachia.com",
      variant: 'accent'
    },
    {
      id: 4,
      title: "WHATSAPP",
      content: "Discutez en direct avec notre service client",
      actionText: "OUVRIR WHATSAPP",
      actionLink: "https://wa.me/33887553333",
      variant: 'primary'
    },
    {
      id: 5,
      title: "CHAT EN DIRECT",
      content: "Assistance immédiate de 8h à 20h, 7j/7",
      actionText: "LANCER LE CHAT",
      actionLink: "#chat",
      variant: 'secondary',
      onClick: () => alert('Connexion au chat en cours...')
    },
    {
      id: 6,
      title: "NOUS RENDRE VISITE",
      content: "123 Avenue du Sport, 75000 Paris",
      actionText: "VOIR SUR LA CARTE",
      actionLink: "https://maps.google.com/?q=123+Avenue+du+Sport,+75000+Paris",
      variant: 'accent'
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      {/* Barre de navigation unique */}
      <Navbar />

      <PageWrapper>
        <HeroSection>
          <HeroTitle>CONTACTEZ-NOUS</HeroTitle>
          <HeroSubtitle>
            Notre équipe est disponible 7j/7 pour vous accompagner dans votre parcours sportif
          </HeroSubtitle>
        </HeroSection>

        <Container>
          <OpeningHours>
            <strong>HORAIRES D'OUVERTURE :</strong><br />
            Lundi - Vendredi : 8h - 20h • Samedi - Dimanche : 9h - 18h
          </OpeningHours>

          <CardsGrid>
            {cards.map((card) => (
              <Card key={card.id} variant={card.variant}>
                <CardTitle>{card.title}</CardTitle>
                <div>{card.content}</div>
                <ActionButton>
                  <ActionLink
                    href={card.actionLink}
                    variant={card.variant}
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      card.onClick ? card.onClick() : handleAction(card.actionLink);
                    }}
                  >
                    {card.actionText} →
                  </ActionLink>
                </ActionButton>
              </Card>
            ))}
          </CardsGrid>

          <FreeShipping>
            <ShippingLink 
              href="#livraison" 
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                alert('Livraison express offerte dès 50€ d\'achat !');
              }}
            >
              LIVRAISON EXPRESS OFFERTE • DÈS 50€ D'ACHAT →
            </ShippingLink>
          </FreeShipping>
        </Container>

        <Footer>
          <FooterContent>
            <FooterLinks>
              <FooterColumn>
                <FooterTitle>FitCoachia</FooterTitle>
                <FooterList>
                  <FooterListItem><FooterLink href="#about">Notre mission</FooterLink></FooterListItem>
                  <FooterListItem><FooterLink href="#team">Notre équipe</FooterLink></FooterListItem>
                  <FooterListItem><FooterLink href="#blog">Blog</FooterLink></FooterListItem>
                </FooterList>
              </FooterColumn>

              <FooterColumn>
                <FooterTitle>Programmes</FooterTitle>
                <FooterList>
                  <FooterListItem><FooterLink href="#running">Course à pied</FooterLink></FooterListItem>
                  <FooterListItem><FooterLink href="#fitness">Fitness</FooterLink></FooterListItem>
                  <FooterListItem><FooterLink href="#nutrition">Nutrition</FooterLink></FooterListItem>
                </FooterList>
              </FooterColumn>

              <FooterColumn>
                <FooterTitle>Aide</FooterTitle>
                <FooterList>
                  <FooterListItem><FooterLink href="#faq">FAQ</FooterLink></FooterListItem>
                  <FooterListItem><FooterLink href="#contact">Contact</FooterLink></FooterListItem>
                  <FooterListItem><FooterLink href="#guides">Guides</FooterLink></FooterListItem>
                </FooterList>
              </FooterColumn>

              <FooterColumn>
                <FooterTitle>Légal</FooterTitle>
                <FooterList>
                  <FooterListItem><FooterLink href="#terms">CGU</FooterLink></FooterListItem>
                  <FooterListItem><FooterLink href="#privacy">Confidentialité</FooterLink></FooterListItem>
                  <FooterListItem><FooterLink href="#cookies">Cookies</FooterLink></FooterListItem>
                </FooterList>
              </FooterColumn>
            </FooterLinks>

            <Copyright>
              © {new Date().getFullYear()} FitCoachia. Tous droits réservés.
            </Copyright>
          </FooterContent>
        </Footer>
      </PageWrapper>
    </ThemeProvider>
  );
};

export default ContactService;