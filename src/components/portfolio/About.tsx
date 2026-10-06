import { Heading, Arrow } from './ui';
export function About() {
  return (
    <section id="about" className="section">
      <Heading
        number="01"
        label="A LITTLE ABOUT ME"
        title="Curious mind. Builder at heart."
        description="Good software starts with understanding people. The code comes next."
      />
      <div className="about-bento">
        <div className="about-story">
          <span className="mono">HELLO, I'M FARID</span>
          <h3>
            I make the complicated
            <br />
            <em>feel simple.</em>
          </h3>
          <p>
            Saya developer berbasis di Indonesia. Saya menghubungkan desain,
            teknologi, dan kebutuhan bisnis untuk membangun produk digital yang
            nyaman digunakan.
          </p>
          <p>
            Dari etalase produk hingga sistem booking, setiap project adalah
            kesempatan untuk membuat sesuatu yang berguna.
          </p>
          <a href="#contact">
            Let's build something <Arrow />
          </a>
        </div>
        <div className="about-mini">
          <span className="mono">01 / THE APPROACH</span>
          <h3>
            Small details.
            <br />
            Better experiences.
          </h3>
          <div className="line-sculpture" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="tags">
            <span>Thoughtful UI</span>
            <span>Responsive by default</span>
          </div>
        </div>
        <div className="about-mini mini-focus">
          <span className="mono">02 / THE FOCUS</span>
          <h3>
            Built for
            <br />
            the real world.
          </h3>
          <div className="focus-list">
            <span>↗ Full Stack Development</span>
            <span>↗ Backend Systems</span>
            <span>↗ Automation</span>
            <span>↗ Interactive Web</span>
          </div>
        </div>
        <div className="about-terminal">
          <div className="terminal-top">
            <span>● ● ●</span> farid.ts
          </div>
          <pre>
            <span className="code-muted">// The way I like to work</span>
            {'\n'}
            <span className="code-purple">const</span> developer = {'{'}
            {'\n'} name: <span className="code-green">"Farid"</span>,{'\n'}{' '}
            location: <span className="code-green">"Indonesia"</span>,{'\n'}{' '}
            approach:{' '}
            <span className="code-green">"Think. Build. Refine."</span>,{'\n'}{' '}
            curiosity: <span className="code-purple">Infinity</span>
            {'\n'}
            {'}'};
          </pre>
          <div className="terminal-status">
            <span className="status-dot" /> always learning{' '}
            <span>UTF-8 &nbsp; TypeScript</span>
          </div>
        </div>
        <div className="about-stat">
          <b>04</b>
          <div>
            <span className="mono">PROJECTS, OUT IN THE WORLD.</span>
            <p>
              Real interfaces you can try.
              <br />
              More ideas on the way.
            </p>
          </div>
          <a href="#projects" aria-label="Explore four live projects">
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
