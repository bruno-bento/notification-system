import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SmtpConfig, SmtpConfigRequestDTO } from "@/types/smtp";
import {
  createSmtp,
  deleteSmtp,
  listAllSmtp,
  updateSmtp,
} from "@/services/smtp";

const SMTPPage: React.FC = () => {
  const [smtpConfigs, setSmtpConfigs] = useState<SmtpConfig[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [currentSmtp, setCurrentSmtp] = useState<SmtpConfigRequestDTO>({
    host: "",
    port: 587,
    username: "",
    password: "",
    useTls: true,
    useSsl: false,
    dailyLimit: 500,
    monthlyLimit: 15000,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch SMTP configs on component mount
  useEffect(() => {
    fetchSmtpConfigs();
  }, []);

  const fetchSmtpConfigs = async () => {
    setIsLoading(true);
    try {
      const response = await listAllSmtp();
      setSmtpConfigs(response.data);
    } catch (error) {
      toast.error("Falha ao carregar configurações SMTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (smtp?: SmtpConfig) => {
    if (smtp) {
      setCurrentSmtp({
        host: smtp.host,
        port: smtp.port,
        username: smtp.username,
        password: smtp.password,
        useTls: smtp.useTls,
        useSsl: smtp.useSsl,
        dailyLimit: smtp.dailyLimit,
        monthlyLimit: smtp.monthlyLimit,
      });
      setEditingId(smtp.id);
    } else {
      setCurrentSmtp({
        host: "",
        port: 587,
        username: "",
        password: "",
        useTls: true,
        useSsl: false,
        dailyLimit: 500,
        monthlyLimit: 15000,
      });
      setEditingId(null);
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setCurrentSmtp({
      host: "",
      port: 587,
      username: "",
      password: "",
      useTls: true,
      useSsl: false,
      dailyLimit: 500,
      monthlyLimit: 15000,
    });
    setEditingId(null);
  };

  const handleOpenDeleteDialog = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setDeleteId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setCurrentSmtp({
        ...currentSmtp,
        [name]: parseInt(value),
      });
    } else {
      setCurrentSmtp({
        ...currentSmtp,
        [name]: value,
      });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setCurrentSmtp({
      ...currentSmtp,
      [name]: checked,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateSmtp(editingId, currentSmtp);
        toast.success("Configuração SMTP atualizada com sucesso");
      } else {
        await createSmtp(currentSmtp);
        toast.success("Configuração SMTP criada com sucesso");
      }
      handleCloseDialog();
      fetchSmtpConfigs();
    } catch (error) {
      toast.error(
        editingId
          ? "Falha ao atualizar configuração SMTP"
          : "Falha ao criar configuração SMTP"
      );
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteSmtp(deleteId);
        toast.success("Configuração SMTP excluída com sucesso");
        fetchSmtpConfigs();
      } catch (error) {
        toast.error("Falha ao excluir configuração SMTP");
      } finally {
        handleCloseDeleteDialog();
      }
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Configurações SMTP</h1>
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar SMTP
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              Servidores SMTP Configurados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : smtpConfigs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Nenhuma configuração SMTP encontrada. Clique em "Adicionar SMTP"
                para começar.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Host</TableHead>
                    <TableHead className="text-gray-300">Porta</TableHead>
                    <TableHead className="text-gray-300">Usuário</TableHead>
                    <TableHead className="text-gray-300">TLS</TableHead>
                    <TableHead className="text-gray-300">SSL</TableHead>
                    <TableHead className="text-gray-300">
                      Limite Diário
                    </TableHead>
                    <TableHead className="text-gray-300">
                      Limite Mensal
                    </TableHead>
                    <TableHead className="text-gray-300 text-right">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {smtpConfigs.map((smtp) => (
                    <TableRow
                      key={smtp.id}
                      className="border-gray-700 hover:bg-gray-700"
                    >
                      <TableCell className="text-gray-300">
                        {smtp.host}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {smtp.port}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {smtp.username}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {smtp.useTls ? "Sim" : "Não"}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {smtp.useSsl ? "Sim" : "Não"}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {smtp.dailyLimit}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {smtp.monthlyLimit}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(smtp)}
                            className="text-gray-400 hover:text-white hover:bg-gray-800"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDeleteDialog(smtp.id)}
                            className="text-gray-400 hover:text-red-500 hover:bg-gray-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId
                ? "Editar Configuração SMTP"
                : "Nova Configuração SMTP"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="host" className="text-gray-300">
                  Host
                </Label>
                <Input
                  id="host"
                  name="host"
                  placeholder="smtp.example.com"
                  value={currentSmtp.host}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port" className="text-gray-300">
                  Porta
                </Label>
                <Input
                  id="port"
                  name="port"
                  type="number"
                  placeholder="587"
                  value={currentSmtp.port}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  Usuário
                </Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="user@example.com"
                  value={currentSmtp.username}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Senha
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={currentSmtp.password}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="useTls"
                  checked={currentSmtp.useTls}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("useTls", checked)
                  }
                  className="data-[state=checked]:bg-yellow-500"
                />
                <Label htmlFor="useTls" className="text-gray-300">
                  Usar TLS
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="useSsl"
                  checked={currentSmtp.useSsl}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("useSsl", checked)
                  }
                  className="data-[state=checked]:bg-yellow-500"
                />
                <Label htmlFor="useSsl" className="text-gray-300">
                  Usar SSL
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dailyLimit" className="text-gray-300">
                  Limite Diário
                </Label>
                <Input
                  id="dailyLimit"
                  name="dailyLimit"
                  type="number"
                  placeholder="500"
                  value={currentSmtp.dailyLimit}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyLimit" className="text-gray-300">
                  Limite Mensal
                </Label>
                <Input
                  id="monthlyLimit"
                  name="monthlyLimit"
                  type="number"
                  placeholder="15000"
                  value={currentSmtp.monthlyLimit}
                  onChange={handleInputChange}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              className="bg-red-500 border-red-600 text-gray-300 hover:bg-red-700 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            >
              {editingId ? "Atualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-800 text-white border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja excluir esta configuração SMTP? Esta ação
              não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SMTPPage;
