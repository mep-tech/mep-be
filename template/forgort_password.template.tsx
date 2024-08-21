import {
  Body,
  Container,
  Column,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Button,
  Heading,
} from '@react-email/components';
import * as React from 'react';
import { icons, media } from './assets/items';

interface MepResetPasswordEmailProps {
  username?: string;
  resetPasswordLink?: string;
  clientUrl?: string;
}

export const MepResetPasswordEmail = ({
  username,
  resetPasswordLink,
  clientUrl,
}: MepResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your password for your Mep account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <Link href={`${clientUrl}`}>
              <Img width={240} src={icons.logoUrl} />
            </Link>
          </Section>
          <Section style={sectionsBorders}>
            <Row>
              <Column style={sectionBorder} />
              <Column style={sectionCenter} />
              <Column style={sectionBorder} />
            </Row>
          </Section>
          <Section style={content}>
            <Heading
              as="h2"
              style={{
                fontSize: 26,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Forgot your password?
            </Heading>
            <Text style={paragraph}>Hello {username}!</Text>
            <Text style={paragraph}>
              You are receiving this email because we received a password reset
              request for your Mep account.
            </Text>
            <Button style={button} href={resetPasswordLink}>
              Reset password
            </Button>
            <Text style={paragraph}>
              This password reset link will expire in 24 hours. Please ensure
              you reset your password before then.
            </Text>
            <Text style={paragraph}>
              If you’re having trouble clicking the "Reset password" button,
              copy and paste the URL below into your web browser:
            </Text>
            <Text style={paragraph}>{resetPasswordLink}</Text>
            <Text style={paragraph}>
              If you don't want to change your password or didn't request this,
              just ignore and delete this message.
            </Text>
            <Text style={paragraph}>
              Still have questions? Please contact{' '}
              <Link href={`${clientUrl}/contact`} style={link}>
                Mep Support
              </Link>
            </Text>
            <Text style={paragraph}>
              Take care,
              <br />
              Mep Support
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          <Row style={footerLogos}>
            <Column>
              <Section>
                <Row>
                  <Column>
                    <Link href={`${media.linkedIn}`}>
                      <Img
                        src={icons.linkedIconUrl}
                        width="20"
                        alt="Mep"
                        style={socialMediaIcon}
                      />
                    </Link>
                  </Column>
                  <Column>
                    <Link href={`${media.twitter}`}>
                      <Img
                        src={icons.twitterIconUrl}
                        width="20"
                        alt="Mep"
                        style={socialMediaIcon}
                      />
                    </Link>
                  </Column>
                  <Column>
                    <Link href={`${media.facebook}`}>
                      <Img
                        src={icons.facebookIconUrl}
                        width="20"
                        alt="Mep"
                        style={socialMediaIcon}
                      />
                    </Link>
                  </Column>
                  <Column>
                    <Link href={`${media.instagram}`}>
                      <Img
                        src={icons.instagramIconUrl}
                        width="20"
                        alt="Mep"
                        style={socialMediaIcon}
                      />
                    </Link>
                  </Column>
                  <Column>
                    <Link href={`${media.youtube}`}>
                      <Img
                        src={icons.youtubeIconUrl}
                        width="20"
                        alt="Mep"
                        style={socialMediaIcon}
                      />
                    </Link>
                  </Column>
                </Row>
              </Section>
            </Column>
          </Row>
          <Row>
            <Text style={{ textAlign: 'center', color: '#b7b7b7' }}>
              © 2024 Mep Erictric, All Rights Reserved. <br />
              Remera - Gisimenti/ Ikaze House F2-22
            </Text>
            <Text
              style={{
                textAlign: 'center',
                color: '#b7b7b7',
                fontSize: '12px',
              }}
            >
              Securely powered by Kiglance
            </Text>
          </Row>
        </Section>
      </Body>
    </Html>
  );
};

export default MepResetPasswordEmail;

const fontFamily = 'Poppins, sans-serif';

const main = {
  backgroundColor: '#efeef1',
  fontFamily,
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};

const container = {
  maxWidth: '580px',
  margin: '30px auto',
  backgroundColor: '#ffffff',
};

const footer = {
  maxWidth: '580px',
  margin: '0 auto',
};

const content = {
  padding: '5px 20px 10px 20px',
};

const logo = {
  display: 'flex',
  justifyContent: 'center',
  alingItems: 'center',
  padding: 30,
};

const sectionsBorders = {
  width: '100%',
  display: 'flex',
};

const sectionCenter = {
  borderBottom: '1px solid rgb(238,238,238)',
  width: '102px',
};

const sectionBorder = {
  borderBottom: '1px solid rgb(238,238,238)',
  width: '249px',
};

const link = {
  textDecoration: 'underline',
};

const button = {
  backgroundColor: '#0075C9',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: "'Poppins', sans-serif",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
};

const footerLogos = {
  paddingLeft: '8px',
  paddingRight: '8px',
  width: 'fit-content',
  maxWidth: '580px',
  margin: '0 auto',
};

const socialMediaIcon = {
  display: 'inline',
  marginLeft: '18px',
};
