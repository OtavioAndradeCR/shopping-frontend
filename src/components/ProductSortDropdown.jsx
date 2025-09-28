import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

const ProductSortDropdown = ({ sortBy, onSortChange }) => {
  return (
    <div className="flex justify-end mb-4">
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Nome (A-Z)</SelectItem>
          <SelectItem value="price_asc">Menor Preço</SelectItem>
          <SelectItem value="price_desc">Maior Preço</SelectItem>
          <SelectItem value="rating">Melhor Avaliação</SelectItem>
          <SelectItem value="newest">Mais Recentes</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSortDropdown;
