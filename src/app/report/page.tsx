import { Report } from '@/components/report';
import { requestTime } from '@/lib/server-time';
export default async function ReportPage(){return <Report now={await requestTime()}/>;}
