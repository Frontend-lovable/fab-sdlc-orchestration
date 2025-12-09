import { MainLayout } from "@/components/layout/MainLayout";

const FormattingResponse = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: 'Helvetica Neue', color: '#3B3B3B' }}>
          Formatting Response
        </h1>
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-muted-foreground">
            Formatting response content will be displayed here.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default FormattingResponse;
