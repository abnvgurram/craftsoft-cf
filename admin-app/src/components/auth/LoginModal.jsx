import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Box, Typography, Avatar, InputAdornment, IconButton, Alert, Slide
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { supabase } from '../../supabase';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function LoginModal({ open, account, onClose, onSuccess }) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // We use the email from the account object to ensure we strictly login to THAT user
            const { error } = await supabase.auth.signInWithPassword({
                email: account.email,
                password: password
            });

            if (error) throw error;
            onSuccess();
        } catch (err) {
            console.error(err);
            setError('Invalid password');
            setLoading(false);
        }
    };

    if (!account) return null;

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            onClose={onClose}
            keepMounted={false}
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    minWidth: 340,
                    p: 1,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                }
            }}
        >
            <Box component="form" onSubmit={handleLogin} sx={{ textAlign: 'center', p: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{
                        width: 64, height: 64, mb: 1.5,
                        background: account.color || 'linear-gradient(135deg, #2896cd 0%, #6C5CE7 100%)',
                        fontSize: '1.5rem', fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(108, 92, 231, 0.3)'
                    }}>
                        {account.full_name?.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: 'Outfit' }}>{account.full_name}</Typography>
                    <Typography variant="body2" color="text.secondary">{account.admin_id}</Typography>
                </Box>

                <DialogTitle sx={{ p: 0, mb: 2, fontSize: '0.9rem', color: 'text.secondary', fontWeight: 500 }}>
                    Enter password to switch account
                </DialogTitle>

                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                <DialogContent sx={{ p: 0, mb: 3 }}>
                    <TextField
                        autoFocus
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        placeholder="Verify your identity"
                        InputProps={{
                            sx: { borderRadius: 2 },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </DialogContent>

                <DialogActions sx={{ p: 0, justifyContent: 'center', gap: 1 }}>
                    <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ px: 4, py: 1, borderRadius: 2, fontWeight: 600, textTransform: 'none' }}
                    >
                        {loading ? 'Switching...' : 'Switch Account'}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
