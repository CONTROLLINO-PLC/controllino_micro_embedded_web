#include <stddef.h>
#include <string.h>
#include <time.h>

#if defined(__cplusplus)
extern "C" {
#endif
const char *mg_unlist(size_t no);
const char *mg_unpack(const char *, size_t *, time_t *);
#if defined(__cplusplus)
}
#endif

