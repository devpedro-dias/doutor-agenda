import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/src/_components/ui/page-container";

import { SubscriptionPlan } from "./_components/subscription-plan";

const SubscriptionPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Assinatura</PageTitle>
          <PageDescription>Gerencie a sua assinatura.</PageDescription>
        </PageHeaderContent>Add commentMore actions
        <PageActions></PageActions>
      </PageHeader>
      <PageContent>
        <SubscriptionPlan className="w-[350px]" />
      </PageContent>
    </PageContainer>
  );
};

export default SubscriptionPage;