export const referenceOrigin = 'https://www.juliaalvarenga.com';
export const image = (path: string) => `${referenceOrigin}${path}`;
export const icons = [
  {file:'nametag.webp',x:14,y:22,w:300,r:-20,delay:0},
  {file:'ace-spades.webp',x:82,y:19,w:260,r:22,delay:.05},
  {file:'harvard-cap.webp',x:88,y:71,w:275,r:18,delay:.1},
  {file:'pen.webp',x:7,y:60,w:300,r:-30,delay:.04},
  {file:'keychain.webp',x:70,y:55,w:195,r:23,delay:.12},
  {file:'halftone-flower.webp',x:64,y:12,w:250,r:18,delay:.08},
  {file:'croissant.webp',x:18,y:80,w:255,r:-10,delay:.2},
  {file:'coffee-bean.webp',x:39,y:91,w:170,r:14,delay:.22},
  {file:'latte.webp',x:82,y:89,w:240,r:-18,delay:.03},
  {file:'receipt.webp',x:7,y:25,w:205,r:13,delay:.15},
  {file:'coffee-cd.webp',x:94,y:43,w:225,r:-17,delay:.1},
  {file:'beautiful-life-ticket.webp',x:51,y:6,w:240,r:22,delay:.16},
  {file:'harvard-cherry.webp',x:37,y:14,w:210,r:-14,delay:.05},
  {file:'blueberry.webp',x:57,y:79,w:160,r:15,delay:.28},
];
export type StopKey = 'machine' | 'camera' | 'cup' | 'music' | 'pastry' | 'notebook' | 'phone' | 'desktop';
export const stops: {key:StopKey; label:string; x:number;y:number;w:number;h:number}[] = [
  {key:'machine',label:'go here for coffee',x:21.4,y:25.215,w:13.6,h:24.47},
  {key:'camera',label:'say cheese',x:5.125,y:54.685,w:20.13,h:19.53},
  {key:'cup',label:'what’s in my cup',x:15.745,y:70.96,w:10.61,h:18.88},
  {key:'music',label:'press play',x:30,y:81.55,w:9,h:12.5},
  {key:'pastry',label:'the pastry case',x:65.52,y:29.295,w:13.18,h:20.83},
  {key:'notebook',label:'what’s on the table',x:65.15,y:70.97,w:15.74,h:14.32},
  {key:'phone',label:'say hi',x:42.64,y:78.44,w:7.5,h:16.6},
  {key:'desktop',label:'open the desktop',x:35.5414,y:38.4129,w:25.33,h:26.82},
];
export const photos = [
  {src:'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900&q=85',caption:'the light we leave on', place:'after dark'},
  {src:'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=85',caption:'things growing quietly',place:'a little colour'},
  {src:'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&q=85',caption:'somewhere between here and there',place:'on the road'},
  {src:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&q=85',caption:'the first cup',place:'slow mornings'},
  {src:'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=85',caption:'a city worth getting lost in',place:'streets'},
  {src:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=85',caption:'the long way home',place:'elsewhere'},
];
