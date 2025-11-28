import { Button } from 'antd';
import { useNavigate } from 'react-router-dom'; 

function TermsAndPolicies() {
  const navigate = useNavigate(); 

  const handleGoToLogin = () => {
    navigate('/'); 
  };

  return (
    <div className="lms-body terms-container" style={{color:"#fff"}}>
      <h1>Terms & Conditions</h1>

      <section>
        <h2>1. Use of Content</h2>
        <p>All videos, documents, quizzes, and learning materials are the property of CyberFrat or its content partners.</p>
        <p><strong>You may:</strong></p>
        <ul>
          <li>Use the content for your own learning.</li>
          <li>Download resources when the platform provides that option.</li>
        </ul>
        <p><strong>You may not:</strong></p>
        <ul>
          <li>Copy, redistribute, upload, or share any content outside the platform.</li>
          <li>Use the content for commercial purposes or to train others without written approval from CyberFrat.</li>
        </ul>
        <p>Any misuse may lead to legal action.</p>
      </section>

      <section>
        <h2>2. Certification</h2>
        <p>Certificates are issued only after you meet the course completion criteria.</p>
      </section>

      <section>
        <h2>3. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Misuse the platform or attempt to bypass its security controls.</li>
          <li>Post harmful, abusive, or illegal content.</li>
          <li>Share, sell, or transfer your account to others.</li>
          <li>Engage in cheating, plagiarism, or fraudulent activity.</li>
        </ul>
        <p>CyberFrat may suspend or terminate your account for any violation of these rules.</p>
      </section>

      <section>
        <h2>4. Platform Availability</h2>
        <p>We aim to keep portal.cfgold.in accessible at all times, but downtime may occur due to maintenance, updates, or unexpected issues.</p>
        <p>If the platform is unavailable, you can continue accessing your learning materials on <a href="https://learn.cyberfrat.com">https://learn.cyberfrat.com</a> as per your membership benefits.</p>
      </section>

      <section>
        <h2>5. Data and Privacy</h2>
        <p>Your personal data is processed according to ISO 27001:2022 Compliance Standard.</p>
        <p>By using the platform, you consent to the use of your information for account management, learning progress tracking, and communication.</p>
      </section>

      <section>
        <h2>6. Third-Party Links</h2>
        <p>Some courses may contain links to third-party sites. CyberFrat does not control these websites and is not responsible for their content, security, or practices.</p>
      </section>

      <section>
        <h2>7. Changes to Terms</h2>
        <p>CyberFrat may update these Terms and Conditions in the future. You can check this page for updated Terms & Conditions.</p>
      </section>

      <section>
        <h2>8. Contact</h2>
        <p>For support or queries, contact: <a href="mailto:support@cfgold.in">support@cfgold.in</a></p>
      </section>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Button
          onClick={handleGoToLogin} 
          type='primary'
        >
          Go to Login Page
        </Button>
      </div>
    </div>
  );
}

export default TermsAndPolicies;
