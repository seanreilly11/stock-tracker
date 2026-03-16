import { Alert } from "antd";

type Props = {
    message: string;
};

const QueryError = ({ message }: Props) => (
    <Alert type="error" message={message} showIcon className="rounded-lg" />
);

export default QueryError;
