---
title: "Executive Board Nominations"
description: "Nominate a member of a PNWORCA club for the PNWORCA Executive Board, or nominate yourself."
permalink: "/nominations/"
layout: layouts/page.njk
templateEngineOverride: njk,md
order: 0
---
Use this form to nominate a member of a PNWORCA club for the PNWORCA Executive Board. You may nominate yourself. Submit each nomination separately.

Nominees must be members in good standing of a PNWORCA member club. Nominees for the Race Chair position must be current members of the Race Committee.

Questions about nominations: [secretary@pnworca.org](mailto:secretary@pnworca.org).

## Executive Board nomination form

<form class="site-form" action="#" method="post" data-endpoint="{{ site.formsUrl }}" style="max-width: 720px">
<input type="hidden" name="form" value="nominations">
<fieldset>
<legend class="cond" style="font-size: 32px; line-height: 1; color: #1E2427; padding: 0; margin-bottom: 4px">Your nomination</legend>
<label>Your name <span aria-hidden="true">*</span><input type="text" name="name" autocomplete="name" required maxlength="200"></label>
<label>Your email <span aria-hidden="true">*</span><input type="email" name="email" autocomplete="email" required maxlength="200"></label>
<label>Your club <span aria-hidden="true">*</span><select name="club" required><option value="">Please select one</option>{% for c in clubs %}<option>{{ c.name }}</option>{% endfor %}<option>Other</option></select></label>
<label>Nomination for <span aria-hidden="true">*</span><select name="position" required><option value="">Please select one</option><option>President</option><option>Vice President</option><option>Sergeant at Arms</option><option>Treasurer</option><option>Secretary</option><option>Race Chair</option><option>USAORCA Representative</option></select></label>
<label>Name of nominee <span aria-hidden="true">*</span><input type="text" name="nominee_name" required maxlength="200"></label>
<label>Nominee email <span aria-hidden="true">*</span><input type="email" name="nominee_email" required maxlength="200"></label>
<label>Nominee club <span aria-hidden="true">*</span><select name="nominee_club" required><option value="">Please select one</option>{% for c in clubs %}<option>{{ c.name }}</option>{% endfor %}<option>Other</option></select></label>
<label>Comment<textarea name="comment" rows="4" maxlength="10000"></textarea></label>
{% set submitLabel = "Submit nomination" %}{% include "partials/form-foot.njk" %}
</fieldset>
</form>
{% include "partials/form-scripts.njk" %}
