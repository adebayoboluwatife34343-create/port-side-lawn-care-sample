import { initCommon, initForm, mountStage, $, $$ } from './common.js';
initCommon({ introMs: 3600 });
initForm($('#qform'), d => `Hi Port Side, I found your sample website and I'd like a free estimate.\nName: ${d.name}\nTown: ${d.area || '-'}\nNeed: ${d.service || '-'}\nDetails: ${d.details}`);
$$('.add').forEach(b => b.addEventListener('click', () => { const t = $(`.pick [data-pick="${b.dataset.pick}"]`); if (t && t.getAttribute('aria-pressed') !== 'true') t.click(); b.textContent = 'Added to your message'; }));
import('./scene.js').then(m => mountStage($('#island'), m.default, { cam: [0, 5, 14], fov: 36, slider: '#paint' })).catch(() => $('#island').classList.add('nogl'));
