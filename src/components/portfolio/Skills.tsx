import { useState } from 'react';
import type { CSSProperties } from 'react';
import { skills } from '../../data/skills';
import { projects } from '../../data/projects';
import { Heading, Arrow } from './ui';
export function Skills() {
  const [category, setCategory] = useState('Frontend');
  const [selected, setSelected] = useState('React');
  const group = skills.find((s) => s.category === category)!;
  const item = group.items.find((s) => s[0] === selected) || group.items[0];
  const used = projects.filter((p) => p.technologies.includes(item[0])).length;
  return (
    <section id="skills" className="section">
      <Heading
        number="02"
        label="THE TOOLKIT"
        title="A considered toolkit."
        description="From interface to infrastructure. Always learning, always building."
      />
      <div className="skills-layout">
        <div className="skill-orbit" aria-hidden="true">
          <div className="orbit-ring" />
          <div className="orbit-ring ring-two" />
          <b>
            F<span>.</span>
          </b>
          {[
            'React',
            'TypeScript',
            'Node.js',
            'PostgreSQL',
            'Git',
            'Three.js',
          ].map((s, i) => (
            <span key={s} style={{ '--i': i } as CSSProperties}>
              {s}
            </span>
          ))}
        </div>
        <div>
          <div className="skill-tabs">
            {skills.map((g) => (
              <button
                key={g.category}
                aria-pressed={category === g.category}
                className={category === g.category ? 'active' : ''}
                onClick={() => {
                  setCategory(g.category);
                  setSelected(g.items[0][0]);
                }}
              >
                {g.category}
              </button>
            ))}
          </div>
          <div className="skill-list">
            {group.items.map(([name, level]) => (
              <button
                className={item[0] === name ? 'selected' : ''}
                key={name}
                onClick={() => setSelected(name)}
              >
                <span>{name}</span>
                <span>
                  {level} <Arrow />
                </span>
              </button>
            ))}
          </div>
          <div className="skill-detail" aria-live="polite">
            <span className="status-dot" />
            <b>{item[0]}</b>
            <span>
              {item[1]} ·{' '}
              {used ? `${used} documented project` : 'Exploring & developing'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
