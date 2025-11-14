import React, { useState } from "react";
import {
  X,
  Search,
  Download,
  RefreshCw,
  Check,
  Filter,
} from "lucide-react";

function LotesAutoGestion() {
  // Generar lotes con sistema FML (Fracción 767)
  const generateLotes = () => {
    const lotes = [];
    let id = 1;
    for (let manzana = 1; manzana <= 24; manzana++) {
      const lotesPerManzana = Math.floor(Math.random() * 20) + 20; // 20-40 lotes por manzana
      for (let lote = 1; lote <= lotesPerManzana; lote++) {
        if (id > 1000) break;
        lotes.push({
          id: id,
          fml: `767-${manzana}-${lote}`,
          franfra: "767",
          lotmanz: manzana,
          lotnlote: lote,
          nombreFraccion: "Fracción San Lorenzo",
          superficie: (Math.random() * 500 + 100).toFixed(2),
          situacion: Math.random() > 0.5 ? "Disponible" : "Reservado",
          cuentaCorrienteCatastral: `CC-767-${String(manzana).padStart(
            2,
            "0"
          )}-${String(lote).padStart(3, "0")}`,
          mideNorte: (Math.random() * 30 + 10).toFixed(2),
          linderoNorte:
            Math.random() > 0.5 ? "Calle Principal" : `Lote ${lote + 1}`,
          mideSur: (Math.random() * 30 + 10).toFixed(2),
          linderoSur:
            Math.random() > 0.5 ? "Avenida Central" : `Lote ${lote - 1}`,
          mideEste: (Math.random() * 40 + 15).toFixed(2),
          linderoEste:
            Math.random() > 0.5 ? "Pasaje Interno" : `Manzana ${manzana + 1}`,
          mideOeste: (Math.random() * 40 + 15).toFixed(2),
          linderoOeste:
            Math.random() > 0.5 ? "Calle Lateral" : `Manzana ${manzana - 1}`,
          esVentaAutoGestionada: Math.random() > 0.7 ? 1 : 0,
        });
        id++;
      }
    }
    return lotes;
  };

  const [todosLotes] = useState(generateLotes());
  const [activeTab, setActiveTab] = useState("asignados");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLotes, setSelectedLotes] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedLote, setSelectedLote] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [filterManzana, setFilterManzana] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const lotesAsignados = todosLotes.filter(
    (l) => l.esVentaAutoGestionada === 1
  );
  const lotesDisponibles = todosLotes.filter(
    (l) => l.esVentaAutoGestionada === 0
  );

  const getCurrentLotes = () => {
    return activeTab === "asignados" ? lotesAsignados : lotesDisponibles;
  };

  const getFilteredLotes = () => {
    let filtered = getCurrentLotes();

    if (searchTerm) {
      filtered = filtered.filter((lote) =>
        Object.values(lote).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterManzana) {
      filtered = filtered.filter(
        (lote) => lote.lotmanz === parseInt(filterManzana)
      );
    }

    if (sortColumn) {
      filtered.sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];

        if (typeof aVal === "string") {
          return sortDirection === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      });
    }

    return filtered;
  };

  const filteredLotes = getFilteredLotes();

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleSelectLote = (loteId) => {
    setSelectedLotes((prev) => {
      if (prev.includes(loteId)) {
        return prev.filter((id) => id !== loteId);
      }
      return [...prev, loteId];
    });
  };

  const handleSelectAll = () => {
    if (selectedLotes.length === filteredLotes.length) {
      setSelectedLotes([]);
    } else {
      setSelectedLotes(filteredLotes.map((l) => l.id));
    }
  };

  const handleQuitarAutoGestion = (lote) => {
    setSelectedLote(lote);
    setConfirmAction("quitar");
    setShowConfirm(true);
  };

  const handleGuardarAsignacion = () => {
    if (selectedLotes.length === 0) {
      alert("Debe seleccionar al menos un lote");
      return;
    }
    setConfirmAction("asignar");
    setShowConfirm(true);
  };

  const confirmarAccion = () => {
    if (confirmAction === "quitar") {
      selectedLote.esVentaAutoGestionada = 0;
      setSuccessMessage(
        `El lote ${selectedLote.fml} ha sido removido de la venta autogestionada exitosamente.`
      );
    } else if (confirmAction === "asignar") {
      selectedLotes.forEach((id) => {
        const lote = todosLotes.find((l) => l.id === id);
        if (lote) lote.esVentaAutoGestionada = 1;
      });
      setSuccessMessage(
        `Se han asignado ${selectedLotes.length} lote(s) a la venta autogestionada exitosamente.`
      );
      setSelectedLotes([]);
    }

    setShowConfirm(false);
    setSelectedLote(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const SortIcon = ({ column }) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Gestión de Lotes - Venta Autogestionada
          </h1>
          <p className="text-gray-600">
            Sistema FML - Fracción 767 | Tabla GXDB.LOTESG
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-lg shadow-md">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("asignados")}
                className={`px-6 py-4 font-semibold ${
                  activeTab === "asignados"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Lotes Asignados ({lotesAsignados.length})
              </button>
              <button
                onClick={() => setActiveTab("disponibles")}
                className={`px-6 py-4 font-semibold ${
                  activeTab === "disponibles"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Lotes NO Asignados ({lotesDisponibles.length})
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Búsqueda rápida (FML, situación, linderos, etc.)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  value={filterManzana}
                  onChange={(e) => setFilterManzana(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas las Manzanas</option>
                  {[...Array(24)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Manzana {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap 2">
              {activeTab === "disponibles" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    <Check className="w-4 h-4" />
                    {selectedLotes.length === filteredLotes.length
                      ? "Deseleccionar"
                      : "Seleccionar"}{" "}
                    Todos
                  </button>
                  {selectedLotes.length > 0 && (
                    <button
                      onClick={handleGuardarAsignacion}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <Check className="w-4 h-4" />
                      Guardar ({selectedLotes.length} seleccionados)
                    </button>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <RefreshCw className="w-4 h-4" />
                  Actualizar
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {activeTab === "disponibles" && (
                    <th className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedLotes.length === filteredLotes.length &&
                          filteredLotes.length > 0
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4"
                      />
                    </th>
                  )}
                  <th
                    onClick={() => handleSort("fml")}
                    className="px-4 py-3 text-left cursor-pointer hover:bg-blue-700"
                  >
                    FML <SortIcon column="fml" />
                  </th>
                  <th
                    onClick={() => handleSort("nombreFraccion")}
                    className="px-4 py-3 text-left cursor-pointer hover:bg-blue-700"
                  >
                    Nombre Fracción <SortIcon column="nombreFraccion" />
                  </th>
                  <th
                    onClick={() => handleSort("superficie")}
                    className="px-4 py-3 text-right cursor-pointer hover:bg-blue-700"
                  >
                    Superficie (m²) <SortIcon column="superficie" />
                  </th>
                  <th
                    onClick={() => handleSort("situacion")}
                    className="px-4 py-3 text-center cursor-pointer hover:bg-blue-700"
                  >
                    Situación <SortIcon column="situacion" />
                  </th>
                  <th className="px-4 py-3 text-left">Cuenta Catastral</th>
                  <th className="px-4 py-3 text-right">Mide Norte</th>
                  <th className="px-4 py-3 text-left">Lindero Norte</th>
                  <th className="px-4 py-3 text-right">Mide Sur</th>
                  <th className="px-4 py-3 text-left">Lindero Sur</th>
                  <th className="px-4 py-3 text-right">Mide Este</th>
                  <th className="px-4 py-3 text-left">Lindero Este</th>
                  <th className="px-4 py-3 text-right">Mide Oeste</th>
                  <th className="px-4 py-3 text-left">Lindero Oeste</th>
                  {activeTab === "asignados" && (
                    <th className="px-4 py-3 text-center">Acciones</th>
                  )}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLotes.length > 0 ? (
                  filteredLotes.map((lote) => (
                    <tr key={lote.id} className="hover:bg-gray-50 transition">
                      {activeTab === "disponibles" && (
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedLotes.includes(lote.id)}
                            onChange={() => handleSelectLote(lote.id)}
                            className="w-4 h-4"
                          />
                        </td>
                      )}

                      <td className="px-4 py-3 font-medium text-blue-700">
                        {lote.fml}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {lote.nombreFraccion}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {lote.superficie}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            lote.situacion === "Disponible"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {lote.situacion}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {lote.cuentaCorrienteCatastral}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {lote.mideNorte}m
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {lote.linderoNorte}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {lote.mideSur}m
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {lote.linderoSur}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {lote.mideEste}m
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {lote.linderoEste}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {lote.mideOeste}m
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {lote.linderoOeste}
                      </td>

                      {activeTab === "asignados" && (
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleQuitarAutoGestion(lote)}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs font-medium"
                          >
                            <X className="w-3 h-3" />
                            Quitar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="15"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No se encontraron lotes con los criterios seleccionados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <p>
                Mostrando{" "}
                <span className="font-semibold">{filteredLotes.length}</span> de{" "}
                <span className="font-semibold">
                  {getCurrentLotes().length}
                </span>{" "}
                lotes
              </p>
              <p>
                Fracción: <span className="font-semibold">767</span> |
                Manzanas: <span className="font-semibold">1-24</span> |
                Total lotes:{" "}
                <span className="font-semibold">{todosLotes.length}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  confirmAction === "quitar" ? "bg-red-100" : "bg-green-100"
                }`}
              >
                {confirmAction === "quitar" ? (
                  <X className="w-6 h-6 text-red-600" />
                ) : (
                  <Check className="w-6 h-6 text-green-600" />
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Confirmar{" "}
                {confirmAction === "quitar" ? "Eliminación" : "Asignación"}
              </h3>
            </div>

            <p className="text-gray-700 mb-6">
              {confirmAction === "quitar"
                ? `¿Está seguro de quitar el lote ${selectedLote?.fml} de la venta autogestionada?`
                : `¿Está seguro de asignar ${selectedLotes.length} lote(s) a la venta autogestionada?`}
            </p>

            {confirmAction === "quitar" && selectedLote && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">FML:</p>
                    <p className="font-semibold">{selectedLote.fml}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Superficie:</p>
                    <p className="font-semibold">
                      {selectedLote.superficie} m²
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Situación:</p>
                    <p className="font-semibold">{selectedLote.situacion}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cuenta Catastral:</p>
                    <p className="font-semibold text-xs">
                      {selectedLote.cuentaCorrienteCatastral}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedLote(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAccion}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition font-medium ${
                  confirmAction === "quitar"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de éxito */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in z-50">
          <Check className="w-6 h-6" />
          <p className="font-medium">{successMessage}</p>
        </div>
      )}

      <style>
        {`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
}

export default LotesAutoGestion;
