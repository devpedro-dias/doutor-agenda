import { Button } from "@/src/_components/ui/button";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/src/_components/ui/page-container";
import { PlusIcon } from "lucide-react";

const DoctorsPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Button>
            <PlusIcon className="mr-2" />
            Novo Medico
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <p>Content</p>
      </PageContent>
    </PageContainer>
  );
};

export default DoctorsPage;
