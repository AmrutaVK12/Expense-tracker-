import { Skeleton, Box } from "@mui/material";

export default function SkeletonCard() {
  return (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="rounded" height={60} />
      <Skeleton sx={{ mt: 1 }} height={30} />
    </Box>
  );
}
