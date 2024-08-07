import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

const AlertDestructive: React.FC<{
  title: string;
  description: string;
}> = ({ title, description }) => (
  <Alert variant="destructive">
    <ExclamationTriangleIcon className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>
      {description}
    </AlertDescription>
  </Alert>
);

export default AlertDestructive