---
"just-bash": patch
---

Fix `expr` evaluating the operand it does not need, so `expr 1 \| 1 / 0` failed with "division by zero" instead of printing `1`. The right side of a true `|` and of a false `&` is now parsed but not evaluated.
