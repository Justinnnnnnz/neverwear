export const hourSeed = (id: string, now: number) => Array.from(id+Math.floor(now/3600000)).reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,0);
export const viewers = (id: string, now: number) => 8+hourSeed(id,now)%30;
export const trackingStep = (createdAt: number, now: number) => now-createdAt>=7200000?3:now-createdAt>=1200000?2:now-createdAt>=180000?1:0;
export const dateLabel = (time: number) => new Intl.DateTimeFormat('zh-CN',{month:'long',day:'numeric',timeZone:'America/Toronto'}).format(time);
export const monthKey = (time: number) => new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',timeZone:'America/Toronto'}).format(time);
