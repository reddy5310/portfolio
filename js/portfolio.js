(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const nested = document.body.dataset.page === 'case';
  const base = nested ? '../' : '';

  // Search is an optional enhancement; all primary navigation is ordinary links.
  const dialog = $('#portfolio-search');
  if (dialog && typeof dialog.showModal === 'function') {
    const input = $('#portfolio-query');
    const results = $('#search-results');
    const count = $('#search-count');
    let opener = null;
    const entries = [
      ['Enterprise GenAI platform', 'Architecture, retrieval, MCP tools, human approvals. 400+ users; 40 concurrent sessions.', 'work/genai-platform.html', 'ai rag bedrock lambda ecs fargate opensearch pgvector semantic kernel strands governance leadership'],
      ['Application modernization factory', 'Java upgrades, automated delivery, validation and stakeholder acceptance.', 'work/modernization.html', 'java 21 25 sisu tanzu github actions 545 migration enterprise 14 25'],
      ['Infrastructure as Code & governance', 'Approved Terraform modules, validation and current Wiz work at MSD.', 'work/iac-governance.html', 'wiz iac terraform checkov security policy infrastructure diagram hcl'],
      ['Interactive infrastructure lab', 'Explore a prepared request, architecture, configuration, policy gate and approval.', 'index.html#lab', 'demo simulation terraform public access policy approval'],
      ['JevBrowse', 'A Windows browser with durable tabs, isolated workspaces and scoped agent permissions.', 'index.html#jevbrowse', 'browser c# dotnet winui webview memory product open source'],
      ['VyayaMitra', 'Private financial documents, on-device OCR and balance reconciliation.', 'index.html#vyayamitra', 'finance privacy react typescript indexeddb pwa statements'],
      ['Antventure', 'A browser game with a fixed-step simulation and a seeded Daily River.', 'index.html#antventure', 'game canvas typescript ant leaf play'],
      ['Professional experience', 'MSD, Cognizant, TCS and Amazon. Platform engineering and leadership.', 'index.html#experience', 'career roles jobs manager teams sre reliability devops'],
      ['About & engineering principles', 'Reusable platforms, human oversight and hands-on product work.', 'index.html#about', 'satya reddy hyderabad india about principles'],
      ['Toolbox & credentials', 'Cloud, DevSecOps, AI engineering, certifications and education.', 'index.html#skills', 'aws azure gcp google certifications education lpu kubernetes wiz'],
      ['Résumé', 'Read the complete professional résumé.', 'resume.html', 'resume cv employment experience'],
      ['Download résumé PDF', 'Printable résumé, including current Wiz-related IaC work.', 'assets/Satyanarayana-Reddy-Resume.pdf', 'resume download cv pdf'],
      ['Contact', 'Email, LinkedIn, GitHub and other ways to get in touch.', 'index.html#contact', 'contact email phone linkedin github hire'],
      ['More products & tools', 'Vriddhi, SatyaTrend, MyHealth 90, Chit Lab and smaller experiments.', 'index.html#project-archive', 'archive vriddhi satyatrend myhealth chit opportunity engine ocr notes clock periodic rummy']
    ];
    const render = () => {
      const terms = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      const matches = entries.filter(entry => terms.every(term => entry.join(' ').toLowerCase().includes(term)));
      results.replaceChildren();
      for (const [title, description, path] of matches) {
        const link = document.createElement('a');
        link.href = base + path;
        const strong = document.createElement('strong');
        strong.textContent = title;
        const summary = document.createElement('span');
        summary.textContent = description;
        link.append(strong, summary);
        if (path.endsWith('.pdf')) link.download = 'Satyanarayana-Reddy-Resume.pdf';
        link.addEventListener('click', () => dialog.close());
        results.append(link);
      }
      count.textContent = `${matches.length} ${matches.length === 1 ? 'result' : 'results'}`;
      if (!matches.length) {
        const empty = document.createElement('p');
        empty.className = 'search-empty';
        empty.textContent = 'No results. Try “Wiz”, “AI”, “leadership” or a project name.';
        results.append(empty);
      }
    };
    const open = (element) => {
      if (dialog.open) return;
      opener = element || document.activeElement;
      input.value = '';
      render();
      dialog.showModal();
      input.focus();
    };
    $$('[data-search-open]').forEach(button => {
      button.hidden = false;
      button.addEventListener('click', () => open(button));
      const hint = $('kbd', button);
      if (hint && /Mac|iPhone|iPad/.test(navigator.platform)) hint.textContent = '⌘ K';
    });
    $('[data-search-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => opener?.focus());
    dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
    input.addEventListener('input', render);
    input.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown') { event.preventDefault(); $('a', results)?.focus(); }
      if (event.key === 'Enter') $('a', results)?.click();
    });
    results.addEventListener('keydown', event => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      const links = $$('a', results);
      const index = links.indexOf(document.activeElement);
      if (index < 0) return;
      event.preventDefault();
      if (event.key === 'ArrowUp' && index === 0) input.focus();
      else links[Math.max(0, Math.min(links.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)))]?.focus();
    });
    document.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (dialog.open) dialog.close(); else open();
      }
    });
  }

  const revealDestination = () => {
    const target = document.getElementById(location.hash.slice(1));
    if (!target) return;
    if (target.matches('details')) target.open = true;
    $$('details', target).forEach(details => { if (target.id === 'skills') details.open = true; });
    let parent = target.parentElement;
    while (parent) { if (parent.matches('details')) parent.open = true; parent = parent.parentElement; }
  };
  revealDestination();
  window.addEventListener('hashchange', revealDestination);

  const copy = $('.copy-email');
  if (copy && navigator.clipboard) {
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      const status = $('.copy-status');
      try { await navigator.clipboard.writeText('mnvdsreddy93@gmail.com'); status.textContent = 'Email address copied.'; }
      catch { status.textContent = 'Copy unavailable. Select the email address above to copy it.'; }
    });
  }

  const scenario = $('#lab-scenario');
  if (!scenario) return;
  const risk = $('#lab-risk');
  const visual = $('#lab-visual');
  const stages = $$('[data-stage]');
  const next = $('#lab-next');
  let stage = 0;
  const names = ['Request', 'Architecture', 'Terraform', 'Policy', 'Approval'];
  const scenarios = {
    service: {
      request: '“Create a private service with a database and centralized logging.”',
      requirements: ['Private application entry point', 'Service-to-database access only', 'Centralized logs and named ownership'],
      architecture: ['Private entry', 'Application service', 'Private database', 'Centralized logs'],
      module: 'private_service',
      description: 'A private application service, a database reachable only by the service, and centralized logs. Environment and ownership must be recorded before provisioning.'
    },
    events: {
      request: '“Process queued events with a worker, a retry path and centralized logging.”',
      requirements: ['Worker consumes a private queue', 'Failed messages have a review path', 'Centralized logs and named ownership'],
      architecture: ['Private queue', 'Event worker', 'Dead-letter queue', 'Centralized logs'],
      module: 'event_worker',
      description: 'An event worker, a private input queue and a dead-letter queue for messages that cannot be processed. Environment, ownership and logging are explicit.'
    }
  };
  const add = (tag, text, className, parent = visual) => { const el = document.createElement(tag); if (text) el.textContent = text; if (className) el.className = className; parent.append(el); return el; };
  const renderLab = () => {
    const data = scenarios[scenario.value];
    const unsafe = risk.checked;
    $('#lab-request').textContent = data.request;
    stages.forEach((button, index) => button.setAttribute('aria-pressed', String(index === stage)));
    $('#lab-position').textContent = `Step ${stage + 1} of 5`;
    next.textContent = stage === 4 ? 'Start again' : `Next: ${names[stage + 1]}`;
    visual.replaceChildren();
    let kicker, title, description;
    if (stage === 0) {
      kicker = 'Understand the intent'; title = 'Make the requirements explicit.'; description = data.description;
      const list = add('ul', '', 'lab-list'); data.requirements.forEach(item => add('li', item, '', list));
    } else if (stage === 1) {
      kicker = 'Choose a reusable pattern'; title = 'Assemble a small, understandable system.';
      description = 'This prepared example maps the request to a fictional approved module. A real workflow must check that its assumptions match the application’s requirements.';
      const flow = add('div', '', 'lab-flow'); data.architecture.forEach(item => add('span', item, '', flow));
    } else if (stage === 2) {
      kicker = 'Inspect the configuration'; title = 'Intent becomes reviewable code.';
      description = 'Illustrative HCL using a fictional module, not deployable production configuration. The public-access setting follows the scenario switch.';
      const code = `# Illustrative module — not deployable\nmodule "workload" {\n  source = "./example-modules/${data.module}"\n\n  environment   = "demo"\n  owner         = "platform-team"\n  logging       = true\n  public_access = ${unsafe ? 'true' : 'false'}\n}`;
      const pre = add('pre', '', 'lab-code'); add('code', code, '', pre);
    } else if (stage === 3) {
      kicker = 'Evaluate the boundary'; title = unsafe ? 'A policy issue stops the plan.' : 'The prepared checks pass.';
      description = 'These deterministic checks explain the workflow. They are not scans from Wiz, Checkov or an enterprise environment.';
      [['Named ownership', true], ['Centralized logging', true], ['Private access only', !unsafe]].forEach(([label, pass]) => {
        const row = add('div', '', 'policy-row'); add('span', label, '', row); add('b', pass ? 'Pass' : 'Blocked', pass ? '' : 'fail', row);
      });
    } else {
      kicker = 'Keep a human decision'; title = unsafe ? 'Resolve the finding before review.' : 'Ready for a human review.';
      description = 'Passing the prepared checks is not deployment authorization. A reviewer still needs to assess intent, access, cost and operational ownership.';
      const state = add('div', '', `approval-state${unsafe ? ' blocked' : ''}`);
      add('strong', unsafe ? 'Blocked · Public access enabled' : 'Awaiting review · No deployment', '', state);
      add('p', unsafe ? 'Turn off the public-access rule to see the plan return to the review stage.' : 'The walkthrough ends here. No cloud resources are created and no approval is submitted.', '', state);
    }
    $('#lab-kicker').textContent = kicker;
    $('#lab-step-title').textContent = title;
    $('#lab-description').textContent = description;
  };
  stages.forEach(button => button.addEventListener('click', () => { stage = Number(button.dataset.stage); renderLab(); }));
  next.addEventListener('click', () => { stage = (stage + 1) % 5; renderLab(); });
  scenario.addEventListener('change', renderLab);
  risk.addEventListener('change', () => { if (risk.checked && stage < 3) stage = 3; renderLab(); });
  renderLab();
})();
