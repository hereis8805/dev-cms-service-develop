import { Card, CardContent, CardHeader } from "@material-ui/core";
import { Title } from "react-admin";

const Dashboard = () => (
  <Card>
    <Title title="엠스토리허브 정산 조회 시스템" />
    {/* <CardHeader title="엠스토리허브 정산 조회 시스템" /> */}
    <CardContent>
      <img src="/only_logo3.png" />
    </CardContent>
  </Card>
);

export default Dashboard;
