import { Box, BoxTitle } from "@/components/box";

export default function FunPage() {
  return (
    <main className="mx-auto w-container [&>*:has(+*)]:border-b [&>*]:border-t-0">
      <Box tr tl br bl as="section">
        <BoxTitle className="px-4 py-4 text-center">Infinite CCG</BoxTitle>
      </Box>
    </main>
  );
}
