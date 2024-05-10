export const getEndpoint = async () => {
  return (await fetch("/api/getEndpoints")).json();
};
