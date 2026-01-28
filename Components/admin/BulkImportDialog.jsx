/**
 * @file BulkImportDialog.jsx
 * @description Диалог массового импорта предметов (вручную или из файла)
 * @author Vododokhov Aleksey
 */

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Диалог массового импорта
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.open - Флаг открытия диалога
 * @param {Function} props.onOpenChange - Обработчик изменения состояния
 * @returns {JSX.Element} Диалог с вкладками для ручного ввода и загрузки файла
 */
export default function BulkImportDialog({ open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState('manual');
  const [manualData, setManualData] = useState('');
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async (items) => {
      const results = await base44.entities.Collectible.bulkCreate(items);
      return results;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['collectibles'] });
      setResult({ success: true, count: data.length });
    },
    onError: (error) => {
      setResult({ success: false, error: error.message });
    }
  });

  const handleManualImport = async () => {
    setImporting(true);
    setResult(null);
    try {
      const lines = manualData.trim().split('\n').filter(l => l.trim());
      const items = lines.map(line => {
        const parts = line.split('\t').length > 1 
          ? line.split('\t') 
          : line.split(',');
        
        return {
          name: parts[0]?.trim() || '',
          type: parts[1]?.trim()?.toLowerCase() || 'coin',
          country: parts[2]?.trim() || '',
          year: parts[3] ? parseInt(parts[3]) : null,
          denomination: parts[4]?.trim() || '',
          current_value: parts[5] ? parseFloat(parts[5]) : null,
          condition: parts[6]?.trim()?.toUpperCase() || '',
          status: 'in_collection'
        };
      }).filter(item => item.name);

      if (items.length === 0) {
        setResult({ success: false, error: 'Не найдено данных для импорта' });
        return;
      }

      importMutation.mutate(items);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setImporting(false);
    }
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
  };

  const handleFileImport = async () => {
    if (!file) return;
    
    setImporting(true);
    setResult(null);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const extracted = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              type: { type: 'string' },
              country: { type: 'string' },
              year: { type: 'number' },
              denomination: { type: 'string' },
              current_value: { type: 'number' },
              condition: { type: 'string' },
              material: { type: 'string' },
              description: { type: 'string' }
            }
          }
        }
      });

      if (extracted.status === 'error') {
        setResult({ success: false, error: extracted.details });
        return;
      }

      const items = (Array.isArray(extracted.output) ? extracted.output : [extracted.output])
        .map(item => ({
          ...item,
          type: item.type?.toLowerCase() || 'coin',
          status: 'in_collection'
        }))
        .filter(item => item.name);

      if (items.length === 0) {
        setResult({ success: false, error: 'Не удалось извлечь данные из файла' });
        return;
      }

      importMutation.mutate(items);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setImporting(false);
    }
  };

  const resetDialog = () => {
    setManualData('');
    setFile(null);
    setResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#1D1D1F]">
            Массовый импорт
          </DialogTitle>
        </DialogHeader>

        {result ? (
          <div className="py-8">
            <div className={cn(
              "w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4",
              result.success ? "bg-green-100" : "bg-red-100"
            )}>
              {result.success ? (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-center text-[#1D1D1F] mb-2">
              {result.success ? 'Импорт завершён' : 'Ошибка импорта'}
            </h3>
            <p className="text-center text-[#86868B]">
              {result.success 
                ? `Успешно импортировано ${result.count} предметов`
                : result.error
              }
            </p>
            <div className="flex justify-center mt-6">
              <Button onClick={resetDialog} className="bg-[#0071E3] hover:bg-[#0077ED] text-white">
                Готово
              </Button>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-[#F5F5F7] p-1 rounded-xl">
              <TabsTrigger value="manual" className="flex-1 rounded-lg">
                <FileText className="w-4 h-4 mr-2" />
                Вручную
              </TabsTrigger>
              <TabsTrigger value="file" className="flex-1 rounded-lg">
                <Upload className="w-4 h-4 mr-2" />
                Файл
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4 mt-4">
              <div>
                <p className="text-sm text-[#86868B] mb-3">
                  Введите данные в формате: Название, Тип (coin/banknote/medal), Страна, Год, Номинал, Стоимость, Состояние
                </p>
                <Textarea
                  value={manualData}
                  onChange={(e) => setManualData(e.target.value)}
                  placeholder={`Рубль Петра I, coin, Россия, 1704, 1 рубль, 150000, VF
5 долларов США, banknote, США, 1934, 5 долларов, 5000, XF`}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
              <Button 
                onClick={handleManualImport}
                disabled={!manualData.trim() || importing}
                className="w-full bg-[#0071E3] hover:bg-[#0077ED] text-white"
              >
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Импорт...
                  </>
                ) : (
                  'Импортировать'
                )}
              </Button>
            </TabsContent>

            <TabsContent value="file" className="space-y-4 mt-4">
              <div>
                <p className="text-sm text-[#86868B] mb-3">
                  Загрузите файл CSV, Excel или PDF с данными коллекции
                </p>
                <label className={cn(
                  "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all",
                  "hover:border-[#0071E3] hover:bg-blue-50/50",
                  file ? "border-[#0071E3] bg-blue-50/50" : "border-gray-200"
                )}>
                  {file ? (
                    <>
                      <FileText className="w-10 h-10 text-[#0071E3] mb-2" />
                      <p className="font-medium text-[#1D1D1F]">{file.name}</p>
                      <p className="text-sm text-[#86868B]">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-[#86868B] mb-2" />
                      <p className="text-sm text-[#86868B]">
                        Нажмите или перетащите файл
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls,.pdf"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              <Button 
                onClick={handleFileImport}
                disabled={!file || importing}
                className="w-full bg-[#0071E3] hover:bg-[#0077ED] text-white"
              >
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Обработка файла...
                  </>
                ) : (
                  'Импортировать'
                )}
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}