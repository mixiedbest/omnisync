import './Disclaimer.css';

export function Disclaimer() {
    return (
        <footer className="disclaimer-footer">
            <div className="disclaimer-content">
                <h3 className="disclaimer-title">Disclaimer</h3>

                <div className="disclaimer-body-static">
                    <p className="disclaimer-intro">
                        OMNISYNC provides audio experiences designed for relaxation, meditation, and personal well-being.
                        Our sound frequencies, binaural beats, and energetic tools are intended to support mindfulness,
                        stress reduction, and emotional balance. They are not a substitute for professional medical advice,
                        diagnosis, or treatment.
                    </p>

                    <div className="disclaimer-section">
                        <h4>Do not use OMNISYNC to replace:</h4>
                        <ul>
                            <li>Medical or psychiatric care</li>
                            <li>Professional counseling or therapy</li>
                            <li>Prescribed medication</li>
                            <li>Emergency services</li>
                        </ul>
                    </div>

                    <p className="disclaimer-warning">
                        If you have a medical condition, mental health condition, are pregnant, have epilepsy or a history
                        of seizures, use a pacemaker, or have concerns about sound stimulation, consult your physician or
                        qualified health professional before using this app.
                    </p>

                    <div className="disclaimer-section">
                        <h4>Stop using OMNISYNC immediately and seek medical attention if you experience:</h4>
                        <ul>
                            <li>Dizziness</li>
                            <li>Severe headache</li>
                            <li>Disorientation</li>
                            <li>Anxiety or distress</li>
                            <li>Any unusual physical or psychological symptoms</li>
                        </ul>
                    </div>

                    <p className="disclaimer-emergency">
                        In case of an emergency, call your local emergency number right away.
                    </p>

                    <p className="disclaimer-agreement">
                        By using OMNISYNC, you acknowledge and agree that all use is at your own discretion and risk.
                        OMNISYNC and its creators are not responsible for any adverse effects, misuse, or outcomes
                        resulting from the use of this app.
                    </p>

                    <div className="disclaimer-copyright">
                        © NeoTheory Music LLC & Mixie 2025
                    </div>
                </div>
            </div>
        </footer>
    );
}
