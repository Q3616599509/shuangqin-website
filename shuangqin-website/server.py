#!/usr/bin/env python3
"""
上海爽勤管理咨询有限公司 — 网站服务
同时提供静态文件 + 邮件发送 API
部署：python3 server.py
"""
import json, os, smtplib, sys
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'data.json')
PORT = int(os.environ.get('PORT', 8080))

MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
    '.woff': 'font/woff', '.woff2': 'font/woff2',
}

def load_smtp_config():
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            cfg = json.load(f).get('emailConfig', {})
        return {
            'enabled': cfg.get('enabled', False),
            'host': cfg.get('smtpHost', 'smtp.exmail.qq.com'),
            'port': int(cfg.get('smtpPort', 465)),
            'ssl': cfg.get('smtpSsl', True),
            'user': cfg.get('smtpUser', ''),
            'pass': cfg.get('smtpPass', ''),
            'to': cfg.get('toEmail', 'contact@shuangqin.com'),
        }
    except Exception as e:
        print(f'[ERROR] 读取配置失败: {e}')
        return None

def send_email(form):
    cfg = load_smtp_config()
    if not cfg or not cfg['enabled']:
        return False, '邮件服务未启用'
    if not cfg['user'] or not cfg['pass']:
        return False, 'SMTP 账号未配置'

    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"【网站咨询】{form.get('name','')} - {form.get('company','')}"
        msg['From'] = cfg['user']
        msg['To'] = cfg['to']
        msg['Reply-To'] = form.get('email', '')

        text = f"""新的网站咨询
══════════════════
时间: {form.get('time','')}
姓名: {form.get('name','')}
公司: {form.get('company','')}
邮箱: {form.get('email','')}
电话: {form.get('phone','')}
服务: {form.get('service','')}
══════════════════
需求:
{form.get('message','')}
---
来自 sqmc.tech 咨询表单"""

        html = f"""<html><body style="font-family:'PingFang SC','Microsoft YaHei',sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#333;">
<h2 style="color:#4B0082;border-bottom:2px solid #4B0082;padding-bottom:10px;">📩 新的网站咨询</h2>
<p style="color:#999;font-size:12px;">{form.get('time','')}</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0;">
<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;width:80px;">姓名</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">{form.get('name','')}</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">公司</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">{form.get('company','')}</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">邮箱</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">{form.get('email','')}</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">电话</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">{form.get('phone','')}</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">服务</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">{form.get('service','')}</td></tr>
</table>
<div style="background:#f5f3ff;padding:16px;border-radius:8px;">
<h4 style="margin:0 0 8px;color:#4B0082;">需求描述</h4>
<p style="margin:0;line-height:1.8;white-space:pre-wrap;">{form.get('message','')}</p>
</div>
<p style="color:#999;font-size:11px;margin-top:24px;">来自 sqmc.tech 网站咨询表单</p>
</body></html>"""

        msg.attach(MIMEText(text, 'plain', 'utf-8'))
        msg.attach(MIMEText(html, 'html', 'utf-8'))

        if cfg['ssl']:
            srv = smtplib.SMTP_SSL(cfg['host'], cfg['port'], timeout=15)
        else:
            srv = smtplib.SMTP(cfg['host'], cfg['port'], timeout=15)
            srv.starttls()
        srv.login(cfg['user'], cfg['pass'])
        srv.sendmail(cfg['user'], [cfg['to']], msg.as_string())
        srv.quit()
        print(f'[Mail] ✅ 已发送: {msg["Subject"]}')
        return True, 'ok'
    except smtplib.SMTPAuthenticationError:
        return False, '邮箱认证失败，请检查账号密码'
    except smtplib.SMTPConnectError:
        return False, '无法连接邮件服务器'
    except Exception as e:
        return False, str(e)


class Handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self._reply(200, b'ok')

    def do_GET(self):
        path = urlparse(self.path).path
        if path == '/api/health':
            return self._reply_json({'status': 'ok'})
        self._serve_file(path)

    def do_POST(self):
        path = urlparse(self.path).path
        if path == '/api/send-email':
            try:
                length = int(self.headers.get('Content-Length', 0))
                form = json.loads(self.rfile.read(length))
                ok, msg = send_email(form)
                return self._reply_json(
                    {'success': ok, 'error': msg if not ok else None},
                    status=200 if ok else 500
                )
            except Exception as e:
                return self._reply_json({'success': False, 'error': str(e)}, 500)
        self._reply(404, b'not found')

    def _serve_file(self, path):
        if path == '/':
            path = '/index.html'
        fp = os.path.realpath(os.path.join(BASE_DIR, path.lstrip('/')))
        if not fp.startswith(os.path.realpath(BASE_DIR)):
            return self._reply(403, b'forbidden')
        if not os.path.isfile(fp):
            fp = os.path.join(BASE_DIR, 'index.html')
        ext = os.path.splitext(fp)[1].lower()
        try:
            with open(fp, 'rb') as f:
                data = f.read()
            self.send_response(200)
            self.send_header('Content-Type', MIME.get(ext, 'application/octet-stream'))
            self.send_header('Content-Length', len(data))
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            self.end_headers()
            self.wfile.write(data)
        except:
            self._reply(500, b'server error')

    def _reply_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self._reply(status, body, 'application/json; charset=utf-8')

    def _reply(self, status, body, mime='text/plain'):
        self.send_response(status)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-Type', mime)
        self.end_headers()
        self.wfile.write(body if isinstance(body, bytes) else body.encode())

    def log_message(self, fmt, *args):
        if '/api/' in str(args[0]):
            print(f'[API] {args[0]}')


if __name__ == '__main__':
    print(f'✅ 服务启动: http://0.0.0.0:{PORT}')
    print(f'📧 API: http://0.0.0.0:{PORT}/api/send-email')
    HTTPServer(('0.0.0.0', PORT), Handler).serve_forever()
