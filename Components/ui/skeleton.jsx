/**
 * @file skeleton.jsx
 * @description Компонент скелетона для отображения загрузки контента (shadcn/ui)
 * @author Vododokhov Aleksey
 */

import { cn } from "@/lib/utils"

/**
 * Компонент скелетона для индикации загрузки
 * @param {Object} props - Свойства компонента
 * @param {string} [props.className] - Дополнительные CSS классы
 * @returns {JSX.Element} Анимированный скелетон
 */
function Skeleton({
  className,
  ...props
}) {
  return (
    (<div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props} />)
  );
}

export { Skeleton }