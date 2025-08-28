import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import visitService from "../../services/visitService";

const getShopTypeColor = (type) => {
  const handleDelete = async (visitId) => {
    if (window.confirm("Are you sure you want to delete this visit report? This action cannot be undone.")) {
      try {
        await visitService.delete(visitId);
        if (onRefresh) onRefresh();
      } catch (error) {
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedVisits.length} visit report(s)? This action cannot be undone.`)) {
      try {
        await Promise.all(selectedVisits.map(id => visitService.delete(id)));
        onSelectionChange([]);
      } catch (error) {
      }
    }
  };
};