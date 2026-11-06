import json,re,os
def W(p,o):open(p,'w',encoding='utf-8').write(json.dumps(o,indent=1,ensure_ascii=False)+'\n')
p='src/_data/races.json';d=json.load(open(p,encoding='utf-8'));by={r['slug']:r for r in d}
x=by['pacific-northwest-challenge-hosted-by-sail-sand-point']
x['summary']="Sand Point Outrigger and Kīkaha O Ke Kai's Lake Washington race from Magnuson Park in Seattle, with four courses to fit a crew's size and ability: a beach-change race off Sand Point, an iron race through the 520 and I-90 bridges with no changes, a water-change race around Mercer Island, and a beach relay with change points around the lake. Two safety boats cover the course, and every canoe must carry one PFD per paddler. Registration is on race day, and the entry fee includes the post-race meal."
x['venue']={"name":"Magnuson Park","street":"7751 63rd Ave NE","city":"Seattle","region":"WA","postal":"98115"}
x['cost']=50
x['schedule']=[["7:00 AM","Check-in opens (closes 9:00 AM)"],["9:30 AM","Safety meeting"],["10:00 AM","All races start"],["3:00 PM","Food served (approx.)"],["4:00 PM","Awards and raffle (approx.)"]]
x['courses']=[{"label":"Beach change race","miles":"18","note":"Seven laps from Sand Point Beach to the buoy north of the swim platform. Any number of paddler changes at the beach. Open division."},{"label":"Iron race","miles":"19","note":"South through the 520 and I-90 bridges to a turn buoy off Seward Park and back. No paddler changes."},{"label":"Water change race","miles":"28","note":"Through the 520 bridge and counterclockwise around Mercer Island. Water changes allowed from 20 minutes after the start."},{"label":"Beach relay","miles":"26","note":"OC6 relay around Lake Washington with set beach change points. Open division."}]
x['coursesHeading']=["Lake Washington,","4 courses"]
x['source']="Host race information sheet, 2026 (Pacific Northwest Challenge 2026 Information.pdf)"
x=by['silverdale-sprints']
x['summary']="Hui Heihei Waʻa's OC6 sprint regatta at Silverdale Waterfront Park. Every event runs on a 250-meter course with 7 or 8 lanes and includes a turn. Clubs pre-register their crews by email before race day, and awards go to the top three clubs in the AA (20 or more events) and A divisions. The beach is tidal and rocky, so bring foot protection and canoe cradles."
x['schedule']=[["7:00 AM","Registration and check-in at the gazebo"],["8:00 AM","Coach and steering meeting"],["8:30 AM","First OC6 race"],["2:00 PM","Raffle tent closes"]]
x['source']="Host race announcement, 2026 (2026 Silverdale Sprints Regatta Announcement.docx)"
x=by['gorge-downwind-champs']
x['summary']="A week-long downwind paddling festival in the Columbia River Gorge for OC, surfski and SUP, based at the Skamania County Fairgrounds in Stevenson, about an hour from Portland. Shuttles run daily from Home Valley Park. The main solo race is held Thursday, Friday or Saturday, on the day with the best wind, and the top five in each pro division share cash prizes."
x['source']="gorgedownwindchamps.com (2027 event page)"
by['rooster-rock-race']['results']="https://drive.google.com/drive/folders/1v-a0lyZAUZ470efGZORBkl-KQff8qxLa"
by['na-poe-o-ke-kai-springs-green-lake-sprints-hosted-by-wakinikona']['results']="https://drive.google.com/file/d/11SJIAVjr6-5ed0HVhvoaTO4W0yECQzii/view"
tex=by['bellingham-bay-classic'];W(p,[r for r in d if r['slug']!='bellingham-bay-classic'])
os.makedirs('docs',exist_ok=True)
W('docs/unpublished-races.json',{"note":"Races taken off the site for now. To publish one again, move its entry back into src/_data/races.json, add a date in raceDates.json if it has one, and remove its line from src/_redirects.","races":[{"unpublished":"2026-11-06","reason":"No 2027 date yet","race":tex}]})
p='src/_data/raceDates.json';d=json.load(open(p,encoding='utf-8'));assert d['dates']['gorge-race']=='2027-07-17';d['dates']['gorge-race']='2027-07-10';W(p,d)
p='src/_data/news.json';s=open(p,encoding='utf-8').read()
for u in ['https://bvsnircbb.cc.rs6.net/','https://www.silverliningmt.org/2025-paddlefest-montana','https://pnworca.org/nominations/']:
  s=re.sub(r'<a [^>]*href=\\"'+re.escape(u)+r'[^"\\]*\\"[^>]*>(.*?)</a>',lambda m:m.group(1),s)
open(p,'w',encoding='utf-8').write(s)
B=lambda n,w,t,u:{"name":n,"where":w,"text":t,"url":u}
W('src/_data/beyondRaces.json',[B("Molokaʻi Hoe","Molokaʻi to Oʻahu, Hawaiʻi","The men's world championship of outrigger canoe racing, across the Kaʻiwi Channel to Waikīkī. Run by the Oahu Hawaiian Canoe Racing Association since 1952.","https://www.molokaihoe.com/"),
B("Na Wahine O Ke Kai","Molokaʻi to Oʻahu, Hawaiʻi","The women's world championship: 41 miles from Hale O Lono on Molokaʻi across the Kaʻiwi Channel to Waikīkī.","https://nawahineokekai.com/"),
B("Queen Liliʻuokalani Canoe Race","Kailua-Kona, Hawaiʻi","The world's largest outrigger canoe race, held each September on the Big Island.","https://qlcanoerace.com/"),
B("Na Pali Challenge","Kauaʻi, Hawaiʻi","A 37-mile mixed water-change race down the Na Pali Coast, presented by the Kauaʻi Outrigger Association.","https://racenapali.com/"),
B("Pailolo Challenge","Maui to Molokaʻi, Hawaiʻi","A channel crossing race across the Pailolo Channel, one of the windiest in Hawaiʻi.","https://www.pailolo.com/"),
B("Catalina Crossing","Catalina Island, California","The US Outrigger Championships, run by the Southern California Outrigger Racing Association each September.","https://www.scora.org/catalina/")])
