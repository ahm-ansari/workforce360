import { Typography } from '@mui/material';
// Assume you've installed a charting library like 'recharts'
import { FunnelChart, Funnel, LabelList, Tooltip } from 'recharts';

export default function RecruitmentFunnelChart() {
  const data = [
    { name: 'Applicants', value: 500, fill: '#8a6cdeff'  },
    { name: 'Screening', value: 250 , fill: '#de6c7bff' },
    { name: 'Interviews', value: 100, fill: '#de9f6cff'  },
    { name: 'Offers', value: 20, fill: '#6ca1deff'  },
    { name: 'Hired', value: 18 , fill: '#a4de6c' },
  ];

  return (
    <>
      <Typography variant="h6">Recruitment Funnel</Typography>
      <FunnelChart responsive={true} width={'90%'} height={335} margin={{right:30}}>
        <Tooltip />
        <Funnel dataKey="value" data={data} isAnimationActive={true} >
        <LabelList  position="right" fill="#a01a1aff" stroke="none" offset={20} dataKey="name"/>
        <LabelList dataKey="value"  fill="#a01a1aff" stroke="none" position="inside" />
        </Funnel>
        <Typography variant="body2" color='#000'>Funnel Chart shows the steps of the recruitment process.</Typography>
      </FunnelChart> 
    </>
  );
}